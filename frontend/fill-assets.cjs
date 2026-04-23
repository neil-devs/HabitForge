const fs = require('fs');
const path = require('path');
const https = require('https');

const publicDir = path.join(__dirname, 'public');
const fontsDir = path.join(publicDir, 'fonts');
const soundsDir = path.join(publicDir, 'sounds');

// Ensure directories exist
if (!fs.existsSync(fontsDir)) fs.mkdirSync(fontsDir, { recursive: true });
if (!fs.existsSync(soundsDir)) fs.mkdirSync(soundsDir, { recursive: true });

// --- 1. PROCEDURAL SOUND GENERATION (.WAV) ---
function writeWav(filename, sampleRate, audioData) {
  const buffer = Buffer.alloc(44 + audioData.length * 2);
  
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + audioData.length * 2, 4);
  buffer.write('WAVE', 8);
  
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  
  buffer.write('data', 36);
  buffer.writeUInt32LE(audioData.length * 2, 40);
  
  for (let i = 0; i < audioData.length; i++) {
    buffer.writeInt16LE(Math.max(-32768, Math.min(32767, audioData[i])), 44 + i * 2);
  }
  
  fs.writeFileSync(filename, buffer);
}

function generateSine(freq, durationSec, sampleRate = 44100, volume = 0.5) {
  const samples = durationSec * sampleRate;
  const data = new Int16Array(samples);
  for (let i = 0; i < samples; i++) {
    // Apply simple envelope (fade out)
    const env = 1 - (i / samples);
    const sample = Math.sin(2 * Math.PI * freq * (i / sampleRate));
    data[i] = sample * 32767 * volume * env;
  }
  return data;
}

function generateArp(freqs, durationPerNote, sampleRate = 44100, volume = 0.5) {
  const noteSamples = durationPerNote * sampleRate;
  const totalSamples = noteSamples * freqs.length;
  const data = new Int16Array(totalSamples);
  
  for (let n = 0; n < freqs.length; n++) {
    const freq = freqs[n];
    for (let i = 0; i < noteSamples; i++) {
      const env = 1 - (i / noteSamples); // Fade out per note
      const sample = Math.sin(2 * Math.PI * freq * (i / sampleRate));
      data[n * noteSamples + i] = sample * 32767 * volume * env;
    }
  }
  return data;
}

function generateNoise(durationSec, sampleRate = 44100, volume = 0.3) {
  const samples = durationSec * sampleRate;
  const data = new Int16Array(samples);
  for (let i = 0; i < samples; i++) {
    const env = 1 - (i / samples);
    data[i] = (Math.random() * 2 - 1) * 32767 * volume * env;
  }
  return data;
}

console.log('Generating UI sounds...');
// Click (short high pop)
writeWav(path.join(soundsDir, 'click.wav'), 44100, generateSine(800, 0.05, 44100, 0.3));

// Success (happy 2-note chime: C5, E5)
writeWav(path.join(soundsDir, 'success.wav'), 44100, generateArp([523.25, 659.25], 0.15, 44100, 0.4));

// Level Up (epic arpeggio: C4, E4, G4, C5)
writeWav(path.join(soundsDir, 'level_up.wav'), 44100, generateArp([261.63, 329.63, 392.00, 523.25], 0.2, 44100, 0.5));

// Error (low buzz/noise)
writeWav(path.join(soundsDir, 'error.wav'), 44100, generateNoise(0.3, 44100, 0.4));

// --- 2. DOWNLOAD FONTS (.WOFF2) ---
// Using Google Fonts API directly is complex, but we can download from open source font repos
const fontsToDownload = [
  {
    name: 'Inter-Regular.woff2',
    url: 'https://github.com/rsms/inter/raw/master/docs/font-files/Inter-Regular.woff2'
  },
  {
    name: 'Inter-Bold.woff2',
    url: 'https://github.com/rsms/inter/raw/master/docs/font-files/Inter-Bold.woff2'
  }
];

console.log('Downloading fonts...');

const downloadFile = (url, dest) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        return reject(new Error(`Failed to download: ${response.statusCode}`));
      }
      const file = fs.createWriteStream(dest);
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
};

Promise.all(fontsToDownload.map(f => downloadFile(f.url, path.join(fontsDir, f.name))))
  .then(() => {
    console.log('All assets successfully populated!');
  })
  .catch(err => {
    console.error('Error downloading fonts:', err.message);
  });

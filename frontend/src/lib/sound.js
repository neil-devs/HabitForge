import { Howl } from 'howler';

const checkSound = new Howl({ src: ['/sounds/check.mp3'], volume: 0.5 });
const uncheckSound = new Howl({ src: ['/sounds/uncheck.mp3'], volume: 0.4 });
const streakSound = new Howl({ src: ['/sounds/streak.mp3'], volume: 0.6 });
const levelupSound = new Howl({ src: ['/sounds/levelup.mp3'], volume: 0.7 });
const badgeSound = new Howl({ src: ['/sounds/badge.mp3'], volume: 0.6 });

export const playSound = (type) => {
  // Check store state before playing (we'll implement the hook to bypass if needed, 
  // but better to handle it where playSound is called to avoid circular deps)
  switch (type) {
    case 'check':
      checkSound.play();
      break;
    case 'uncheck':
      uncheckSound.play();
      break;
    case 'streak':
      streakSound.play();
      break;
    case 'levelup':
      levelupSound.play();
      break;
    case 'badge':
      badgeSound.play();
      break;
    default:
      break;
  }
};

// Gamification Engine Logic - XP and Leveling
const LEVELS = [
  { level: 1, xp: 0, title: 'Seedling' },
  { level: 2, xp: 100, title: 'Sprout' },
  { level: 3, xp: 200, title: 'Sapling' },
  { level: 4, xp: 350, title: 'Novice' },
  { level: 5, xp: 500, title: 'Apprentice' },
  { level: 6, xp: 700, title: 'Initiate' },
  { level: 7, xp: 900, title: 'Explorer' },
  { level: 8, xp: 1100, title: 'Seeker' },
  { level: 9, xp: 1300, title: 'Journeyman' },
  { level: 10, xp: 1500, title: 'Practitioner' },
  { level: 11, xp: 1800, title: 'Practitioner II' },
  { level: 12, xp: 2100, title: 'Practitioner III' },
  { level: 13, xp: 2400, title: 'Veteran' },
  { level: 14, xp: 2700, title: 'Veteran II' },
  { level: 15, xp: 3000, title: 'Veteran III' },
  { level: 16, xp: 3400, title: 'Adept Initiate' },
  { level: 17, xp: 3800, title: 'Adept Seeker' },
  { level: 18, xp: 4200, title: 'Adept Journeyman' },
  { level: 19, xp: 4600, title: 'Adept Practitioner' },
  { level: 20, xp: 5000, title: 'Adept' },
  { level: 21, xp: 5500, title: 'Adept II' },
  { level: 22, xp: 6000, title: 'Adept III' },
  { level: 23, xp: 6600, title: 'Expert Initiate' },
  { level: 24, xp: 7200, title: 'Expert Seeker' },
  { level: 25, xp: 7900, title: 'Expert Journeyman' },
  { level: 26, xp: 8600, title: 'Expert Practitioner' },
  { level: 27, xp: 9400, title: 'Expert Veteran' },
  { level: 28, xp: 10200, title: 'Elite' },
  { level: 29, xp: 11100, title: 'Elite II' },
  { level: 30, xp: 12000, title: 'Expert' },
  { level: 31, xp: 13100, title: 'Master Initiate' },
  { level: 32, xp: 14200, title: 'Master Seeker' },
  { level: 33, xp: 15400, title: 'Master Journeyman' },
  { level: 34, xp: 16700, title: 'Master Practitioner' },
  { level: 35, xp: 18000, title: 'Master Veteran' },
  { level: 36, xp: 19300, title: 'Grandmaster Initiate' },
  { level: 37, xp: 20700, title: 'Grandmaster Seeker' },
  { level: 38, xp: 22100, title: 'Grandmaster Journeyman' },
  { level: 39, xp: 23500, title: 'Grandmaster Practitioner' },
  { level: 40, xp: 25000, title: 'Master' },
  { level: 41, xp: 27000, title: 'Master II' },
  { level: 42, xp: 29000, title: 'Master III' },
  { level: 43, xp: 31000, title: 'Legend Initiate' },
  { level: 44, xp: 33500, title: 'Legend Seeker' },
  { level: 45, xp: 36000, title: 'Legend Journeyman' },
  { level: 46, xp: 38500, title: 'Legend Practitioner' },
  { level: 47, xp: 41000, title: 'Legend Veteran' },
  { level: 48, xp: 44000, title: 'Mythic' },
  { level: 49, xp: 47000, title: 'Mythic II' },
  { level: 50, xp: 50000, title: 'Legend' }
];

const calculateLevel = (xpTotal) => {
  let currentLevel = LEVELS[0];
  let nextLevel = LEVELS[1] || null;

  for (let i = 0; i < LEVELS.length; i++) {
    if (xpTotal >= LEVELS[i].xp) {
      currentLevel = LEVELS[i];
      nextLevel = LEVELS[i + 1] || null;
    } else {
      break;
    }
  }

  return { currentLevel, nextLevel };
};

module.exports = {
  LEVELS,
  calculateLevel,
};

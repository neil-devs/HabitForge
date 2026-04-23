const { LEVELS, calculateLevel } = require('../../utils/xpCalculator');

class GamificationEngine {
  constructor() {
    this.levels = LEVELS;
  }

  calculateLevel(xpTotal) {
    return calculateLevel(xpTotal);
  }

  // Returns array of badge slugs that the user should earn based on their stats
  evaluateBadges(stats, unearnedBadges) {
    const earnedSlugs = [];

    for (const badge of unearnedBadges) {
      let earned = false;
      
      switch (badge.condition_type) {
        case 'streak':
          earned = stats.maxStreak >= badge.condition_value;
          break;
        case 'completion_count':
          // could be total or category specific based on slug naming logic
          if (badge.slug === 'mindful-master') earned = stats.mindfulnessCompletions >= badge.condition_value;
          else if (badge.slug === 'fitness-freak') earned = stats.fitnessCompletions >= badge.condition_value;
          else if (badge.slug === 'bookworm') earned = stats.learningCompletions >= badge.condition_value;
          else if (badge.slug === 'hydrated') earned = stats.waterCompletions >= badge.condition_value;
          else earned = stats.totalCompletions >= badge.condition_value;
          break;
        case 'perfect_week':
          earned = stats.perfectWeeks >= badge.condition_value;
          break;
        case 'level':
          earned = stats.level >= badge.condition_value;
          break;
        case 'habit_count':
          earned = stats.activeHabits >= badge.condition_value;
          break;
        case 'social':
          if (badge.slug === 'social-butterfly') earned = stats.friendCount >= badge.condition_value;
          if (badge.slug === 'early-bird') earned = stats.earlyBirdDays >= badge.condition_value;
          if (badge.slug === 'night-owl') earned = stats.nightOwlDays >= badge.condition_value;
          if (badge.slug === 'early-adopter') earned = true; // awarded on signup essentially
          break;
        case 'challenge':
          earned = stats.challengesCompleted >= badge.condition_value;
          break;
      }

      if (earned) {
        earnedSlugs.push(badge.slug);
      }
    }

    return earnedSlugs;
  }
}

module.exports = new GamificationEngine();

const aiService = require('./ai.service');

const getCoachInsight = async (req, res) => {
  const insight = await aiService.getDailyInsight(req.user.id);
  res.json({ success: true, data: insight });
};

module.exports = {
  getCoachInsight
};

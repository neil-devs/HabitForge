const guildsService = require('./guilds.service');

const createGuild = async (req, res) => {
  const { name, description, emblem } = req.body;
  const guild = await guildsService.createGuild(req.user.id, name, description, emblem);
  res.status(201).json({ success: true, data: guild });
};

const getGuilds = async (req, res) => {
  const guilds = await guildsService.getGuilds();
  res.json({ success: true, data: guilds });
};

const getGuildDetails = async (req, res) => {
  const guild = await guildsService.getGuildDetails(req.params.id);
  res.json({ success: true, data: guild });
};

const getMyGuild = async (req, res) => {
  const guild = await guildsService.getUserGuild(req.user.id);
  res.json({ success: true, data: guild });
};

const joinGuild = async (req, res) => {
  await guildsService.joinGuild(req.user.id, req.params.id);
  res.json({ success: true, message: 'Joined guild successfully' });
};

const leaveGuild = async (req, res) => {
  await guildsService.leaveGuild(req.user.id);
  res.json({ success: true, message: 'Left guild successfully' });
};

module.exports = {
  createGuild,
  getGuilds,
  getGuildDetails,
  getMyGuild,
  joinGuild,
  leaveGuild
};

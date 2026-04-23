const express = require('express');
const router = express.Router();
const challengesService = require('./challenges.service');
const { sendSuccess } = require('../../utils/response');
const authenticate = require('../../middleware/authenticate');
const validate = require('../../middleware/validate');
const { createChallengeSchema } = require('./challenges.schema');

router.use(authenticate);

router.get('/', async (req, res) => {
  const publicChallenges = await challengesService.getAll();
  const myChallenges = await challengesService.getMyChallenges(req.user.id);
  sendSuccess(res, { public: publicChallenges, mine: myChallenges }, 'Challenges retrieved');
});

router.post('/', validate(createChallengeSchema), async (req, res) => {
  const challenge = await challengesService.create(req.user.id, req.body);
  sendSuccess(res, challenge, 'Challenge created', 201);
});

router.get('/:id', async (req, res) => {
  const challenge = await challengesService.getById(req.params.id);
  sendSuccess(res, challenge, 'Challenge detail retrieved');
});

router.post('/:id/join', async (req, res) => {
  const result = await challengesService.join(req.user.id, req.params.id);
  sendSuccess(res, null, result.message);
});

router.patch('/:id/progress', async (req, res) => {
  const { progress } = req.body;
  const result = await challengesService.updateProgress(req.user.id, req.params.id, progress);
  sendSuccess(res, result, 'Progress updated');
});

router.delete('/:id', async (req, res) => {
  await challengesService.delete(req.user.id, req.params.id);
  sendSuccess(res, null, 'Challenge deleted');
});

module.exports = router;

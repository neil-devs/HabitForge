const express = require('express');
const router = express.Router();
const remindersService = require('./reminders.service');
const { sendSuccess } = require('../../utils/response');
const authenticate = require('../../middleware/authenticate');
const validate = require('../../middleware/validate');
const { createReminderSchema, updateReminderSchema } = require('./reminders.schema');

router.use(authenticate);

router.get('/', async (req, res) => {
  const data = await remindersService.getAll(req.user.id);
  sendSuccess(res, data, 'Reminders retrieved');
});

router.post('/', validate(createReminderSchema), async (req, res) => {
  const data = await remindersService.create(req.user.id, req.body);
  sendSuccess(res, data, 'Reminder created', 201);
});

router.patch('/:id', validate(updateReminderSchema), async (req, res) => {
  const data = await remindersService.update(req.user.id, req.params.id, req.body);
  sendSuccess(res, data, 'Reminder updated');
});

router.delete('/:id', async (req, res) => {
  await remindersService.delete(req.user.id, req.params.id);
  sendSuccess(res, null, 'Reminder deleted');
});

module.exports = router;

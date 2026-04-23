const express = require('express');
const router = express.Router();
const goalsController = require('./goals.controller');
const validate = require('../../middleware/validate');
const authenticate = require('../../middleware/authenticate');
const schemas = require('./goals.schema');

router.use(authenticate);

router.get('/', goalsController.getAll);
router.post('/', validate(schemas.createGoalSchema), goalsController.create);
router.patch('/:id', validate(schemas.updateGoalSchema), goalsController.update);
router.delete('/:id', goalsController.delete);
router.patch('/:id/complete', goalsController.complete);

module.exports = router;

const express = require('express');
const router = express.Router();
const habitsController = require('./habits.controller');
const validate = require('../../middleware/validate');
const authenticate = require('../../middleware/authenticate');
const schemas = require('./habits.schema');

router.use(authenticate);

router.get('/', habitsController.getAll);
router.post('/', validate(schemas.createHabitSchema), habitsController.create);
router.patch('/reorder', validate(schemas.reorderSchema), habitsController.reorder);
router.get('/:id', habitsController.getById);
router.patch('/:id', validate(schemas.updateHabitSchema), habitsController.update);
router.delete('/:id', habitsController.delete);

module.exports = router;

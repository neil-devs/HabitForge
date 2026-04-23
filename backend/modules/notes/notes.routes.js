const express = require('express');
const router = express.Router();
const notesController = require('./notes.controller');
const authenticate = require('../../middleware/authenticate');

router.use(authenticate);

router.get('/', notesController.getAll);
router.post('/', notesController.create);
router.patch('/:id', notesController.update);
router.delete('/:id', notesController.delete);

module.exports = router;

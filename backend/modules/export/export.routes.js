const express = require('express');
const router = express.Router();
const exportController = require('./export.controller');
const authenticate = require('../../middleware/authenticate');

router.use(authenticate);

router.get('/csv', exportController.exportCsv);
router.get('/pdf', exportController.exportPdf);
router.get('/txt', exportController.exportTxt);

module.exports = router;

const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');

router.get('/last-week', reportController.getLeadsClosedLastWeek);
router.get('/pipeline', reportController.getTotalLeadsInPipeline);

module.exports = router;
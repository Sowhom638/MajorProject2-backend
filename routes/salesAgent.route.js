const express = require('express');
const router = express.Router();
const {
    createSalesAgent,
    getAllSalesAgents
} = require('../controllers/salesAgent.controller');

router.post('/', createSalesAgent);
router.get('/', getAllSalesAgents);

module.exports = router;
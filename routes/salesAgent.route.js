const express = require('express');
const router = express.Router();
const {
    createSalesAgent,
    getAllSalesAgents,
    deleteSalesAgent
} = require('../controllers/salesAgent.controller');

router.post('/', createSalesAgent);
router.get('/', getAllSalesAgents);
router.delete('/:id', deleteSalesAgent);

module.exports = router;
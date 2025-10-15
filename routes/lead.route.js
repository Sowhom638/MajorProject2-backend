// routes/lead.routes.js
const express = require('express');
const router = express.Router();
const {
   createLead,
    getAllLeads,
    getLeadsById,
    updateLeadById,
    deleteLeadById
} = require('../controllers/lead.controller');


router.get('/', getAllLeads);
router.post('/', createLead);
router.get('/:id', getLeadsById);
router.post('/:id', updateLeadById);
router.delete('/:id', deleteLeadById);

module.exports = router;
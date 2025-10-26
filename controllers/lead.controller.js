const Lead = require('../models/lead.model');
const SalesAgent = require('../models/salesAgent.model');

async function createLead(req, res) {
    try {
        const { name, source, salesAgent, status, tags, timeToClose, priority } = req.body;
        const findAgent = await SalesAgent.findById(salesAgent);
        if (!findAgent) return res.status(404).json({ message: 'SalesAgent ID not found' }); // ← Added return
        
        if(name && source && salesAgent && status && tags && timeToClose >= 0 && priority ){
            const newLead = new Lead({ name, source, salesAgent, status, tags, timeToClose, priority });
            const savedLead = await newLead.save();
            return res.status(201).json({ message: 'Lead created successfully', lead: savedLead }); // ← Added return
        }
        return res.status(400).json({ message: 'Missing required fields' }); // ← Handle validation failure
    } catch (error) {
        return res.status(500).json({ message: 'Error creating lead: ' + error.message }); // ← Return object, not string
    }
}

async function getAllLeads(req, res) {
    try {
        const leads = await Lead.find().populate('salesAgent');
        if (leads.length > 0) {
            res.status(200).json({ message: 'Leads fetched successfully', leads });
        }else{
            res.status(404).json({ message: 'No leads found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Error fetching leads: ' + error });
    }
}

async function getLeadsById(req, res) {
    try {
        const lead = await Lead.findById(req.params.id).populate('salesAgent');
        if (lead) {
            // Calculate remaining days only if lead is not closed
            let remainingDays = null;
            
            if (lead.status !== 'Closed') {
                const now = new Date();
                const targetCloseDate = new Date(lead.createdAt);
                targetCloseDate.setDate(targetCloseDate.getDate() + lead.timeToClose);
                
                const diffMs = targetCloseDate - now;
                if (diffMs <= 0) {
                    remainingDays = 0;
                } else {
                    remainingDays = diffMs;
                }
            }

            // Add remainingDays to the response
            res.status(200).json({ 
                message: 'Leads fetched successfully', 
                lead: {
                    ...lead.toObject(),
                    timeToClose: remainingDays
                }
            });
        } else {
            res.status(404).json({ message: 'No leads found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Error fetching leads: ' + error });
    }
}

async function updateLeadById(req, res) {
    try {
        const { id } = req.params;

        const updatedLead = await Lead.findOneAndUpdate(
            { _id: id },
            req.body,
            { 
                new: true
            }
        ).populate('salesAgent');

        if (!updatedLead) {
            return res.status(404).json({ message: 'Lead not found' });
        }

        res.status(200).json({ 
            message: 'Lead updated successfully', 
            lead: updatedLead 
        });
    } catch (error) {
        console.error("Update lead error:", error);
        res.status(400).json({ 
            message: 'Error updating lead: ' + error.message 
        });
    }
}

async function deleteLeadById(req, res) {
    try {
        const { id } = req.params;
        const deletedLead = await Lead.findOneAndDelete({_id: id});
        if (deletedLead) {
            res.status(200).json({ message: 'Lead deleted successfully', lead: deletedLead });
        }else{
            res.status(404).json({ message: 'Lead not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Error deleting lead: ' + error });
    }
}

module.exports = {
    createLead,
    getAllLeads,
    getLeadsById,
    updateLeadById,
    deleteLeadById
};
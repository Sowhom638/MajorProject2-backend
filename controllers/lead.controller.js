const Lead = require('../models/lead.model');
const SalesAgent = require('../models/salesAgent.model');

async function createLead(req, res) {
    try {
        const { name, source, salesAgent, status, tags, timeToClose, priority } = req.body;
        const findAgent = await SalesAgent.findById(salesAgent);
        if (!findAgent) return res.status(404).json({ message: 'SalesAgent ID not found' }); // ← Added return
        
        if(name && source && salesAgent && status && tags && timeToClose && priority ){
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
            res.status(200).json({ message: 'Leads fetched successfully', lead });
        }else{
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

        // 🔒 Step 1: Validate that the ID is a valid MongoDB ObjectId
        if (!Types.ObjectId.isValid(id)) {
            return res.status(400).json({ 
                message: 'Invalid lead ID: not a valid ObjectId' 
            });
        }

        // 🔍 Step 2: Use findByIdAndDelete (it handles casting safely)
        const deletedLead = await Lead.findByIdAndDelete(id);

        if (!deletedLead) {
            return res.status(404).json({ 
                message: 'Lead not found' 
            });
        }

        // ✅ Success
        return res.status(200).json({
            message: 'Lead deleted successfully',
            lead: deletedLead
        });

    } catch (error) {
        // 🚨 Log the real error for debugging (never expose raw error in prod!)
        console.error('Error in deleteLeadById:', error);

        // Return generic 500 to client
        return res.status(500).json({
            message: 'Failed to delete lead due to server error'
        });
    }

}

module.exports = {
    createLead,
    getAllLeads,
    getLeadsById,
    updateLeadById,
    deleteLeadById
};
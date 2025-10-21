const SalesAgent = require('../models/salesAgent.model');


async function createSalesAgent(req, res) {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({ error: "Invalid input: 'name' is required and must be a non-empty string." });
        }

        const newAgent = new SalesAgent({ name: name.trim(), email: email.toLowerCase().trim() });
        const savedAgent = await newAgent.save();

        return res.status(201).json({
            id: savedAgent._id.toString(),
            name: savedAgent.name,
            email: savedAgent.email,
            createdAt: savedAgent.createdAt
        });

    } catch (error) {
        return res.status(409).json({
            error: `Sales agent with email '${error.keyValue.email}' already exists.`
        });

    }
}

async function getAllSalesAgents(req, res) {
    try {
        const agents = await SalesAgent.find(); // Only select name and email
        if (agents.length > 0) return res.status(200).json(agents);
    } catch (error) {
        console.error('Error fetching sales agents:', error);
        return res.status(500).json({ error: 'Failed to fetch sales agents.' });
    }
}

async function deleteSalesAgent(req, res) {
    try {
        const { id } = req.params;
        const agent = await SalesAgent.findOneAndDelete({ _id: id }); // Only select name and email
        if (agent) {
            res.status(200).json({ message: 'SalesAgent deleted successfully', agent });
        } else {
            res.status(404).json({ message: 'SalesAgent not found' });
        }
    } catch (error) {
        console.error('Error deleting sales agent:', error);
        return res.status(500).json({ error: 'Failed to delete sales agent.' });
    }
}

module.exports = {
    createSalesAgent,
    getAllSalesAgents,
    deleteSalesAgent
};
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
        const agents = await SalesAgent.find({}, 'name email'); // Only select name and email

        const formattedAgents = agents.map(agent => ({
            id: agent._id.toString(),
            ...agent._doc
        }));

        return res.status(200).json(formattedAgents);
    } catch (error) {
        console.error('Error fetching sales agents:', error);
        return res.status(500).json({ error: 'Failed to fetch sales agents.' });
    }
}

module.exports = {
    createSalesAgent,
    getAllSalesAgents
};
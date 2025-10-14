// report.controller.js
const Lead = require('../models/lead.model');
const SalesAgent = require('../models/salesAgent.model');

async function getLeadsClosedLastWeek(req, res) {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const leads = await Lead.find({
            status: 'Closed',
            closedAt: { $gte: sevenDaysAgo }
        })
        .select('name salesAgent closedAt') // only needed fields
        .populate('salesAgent') // populate only the 'name' field of salesAgent
        .lean();

        const formattedLeads = leads.map(lead => ({
            id: lead._id.toString(),
            name: lead.name,
            salesAgent: lead.salesAgent ? lead.salesAgent.name : 'Unknown',
            closedAt: lead.closedAt
        }));

        return res.status(200).json(formattedLeads);
    } catch (error) {
        console.error('Error fetching leads closed last week:', error);
        return res.status(500).json({ message: 'Error fetching report: ' + error.message });
    }
}

async function getTotalLeadsInPipeline(req, res) {
    try {
        const totalLeadsInPipeline = await Lead.countDocuments({
            status: { $ne: 'Closed' }
        });

        return res.status(200).json({ totalLeadsInPipeline });
    } catch (error) {
        console.error('Error fetching pipeline count:', error);
        return res.status(500).json({ message: 'Error fetching pipeline count: ' + error.message });
    }
}

module.exports = {
    getLeadsClosedLastWeek,
    getTotalLeadsInPipeline
};
const Comment = require('../models/comment.model');
const Lead = require('../models/lead.model');
const SalesAgent = require('../models/salesAgent.model');

async function addComment(req, res) {
    try {
        const lead = req.params.id;
        const { author, commentText } = req.body;
        if (lead && author && commentText) {
            const leadExists = await Lead.findById(lead);
            if (!leadExists) return res.status(404).json({ message: 'Lead ID not found' });
            const authorExists = await SalesAgent.findById(author);
            if (!authorExists) return res.status(404).json({ message: 'Author (SalesAgent) ID not found' });
            const newComment = new Comment({ lead, author, commentText });
            const savedComment = await newComment.save();
            return res.status(201).json({ message: 'Comment added successfully', comment: savedComment });
        } else {
            return res.status(400).json({ message: 'Missing required fields: lead (from URL), author, commentText' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Error adding comment: ' + error });
    }
}

async function getAllComments(req, res) {
    try {
        const comments = await Comment.find().populate('author', 'name');
        if (comments.length > 0) {
            res.status(200).json({ message: 'Comments fetched successfully', comments });
        } else {
            res.status(404).json({ message: 'No comments found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Error fetching comments: ' + error });
    }
}

module.exports = {
    addComment,
    getAllComments
};
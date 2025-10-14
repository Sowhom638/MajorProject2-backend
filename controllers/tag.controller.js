const Tag = require("../models/tag.model");

async function createTag(req, res) {
    try {
        const { name } = req.body;

        // Validate input
        if (!name || typeof name !== 'string' || name.trim() === '') {
            return res.status(400).json({
                error: "Tag name is required and must be a non-empty string."
            });
        }

        const tag = new Tag({ name: name.trim() });
        const savedTag = await tag.save();

        return res.status(201).json({
            message: "Tag created successfully",
            tag: {
                id: savedTag._id.toString(),
                name: savedTag.name,
                createdAt: savedTag.createdAt
            }
        });
    } catch (error) {
        res.status(400).json({ Error: "Error while creating tag", error });
    }
}

async function getAllTag(req, res) {
    try {
        const tags = await Tag.find({}, 'name createdAt');

        if (tags.length === 0) {
            return res.status(404).json({ error: "No tags found." });
        }

        const formattedTags = tags.map(tag => ({
            id: tag._id.toString(),
            name: tag.name,
            createdAt: tag.createdAt
        }));

        return res.status(200).json({
            message: "Tags fetched successfully",
            tags: formattedTags
        });
    } catch (error) {
        res.status(400).json({ Error: "Error while fetching tag", error });
    }
}

module.exports = {
    createTag,
    getAllTag
}
const express = require('express');
const router = express.Router();
const {
    addComment,
    getAllComments
} = require('../controllers/comment.controller');

router.post('/:id/comments', addComment);
router.get('/:id/comments', getAllComments);

module.exports = router;
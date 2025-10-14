const express = require("express");
const router = express.Router();
const {
    createTag,
    getAllTag
} = require("../controllers/tag.controller");

router.post("/", createTag);
router.get("/", getAllTag);

module.exports = router;
const express = require("express");
const Poll = require("../models/Poll");

const router = express.Router();

// Create a new poll
router.post("/", async (req, res) => {
    try {
        const poll = new Poll(req.body);
        await poll.save();
        res.status(201).json(poll);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all polls
router.get("/", async (req, res) => {
    try {
        const polls = await Poll.find();
        res.json(polls);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update vote count
router.post("/:id/vote", async (req, res) => {
    try {
        const { option } = req.body;
        const poll = await Poll.findById(req.params.id);
        if (!poll) return res.status(404).json({ message: "Poll not found" });

        const optionToUpdate = poll.options.find(opt => opt.option === option);

        if (!optionToUpdate) {
            return res.status(400).json({ message: "Option not found" });
        }

        optionToUpdate.votes += 1;
        await poll.save();

        res.json(poll);
    } catch (error) {
        res.status(500).json({ message: "Error submitting vote: " + error.message });
    }
});

// Delete a poll
router.delete("/:id", async (req, res) => {
    try {
        const poll = await Poll.findByIdAndDelete(req.params.id);
        if (!poll) return res.status(404).json({ message: "Poll not found" });

        res.json({ message: "Poll deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

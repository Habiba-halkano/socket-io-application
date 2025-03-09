const Poll = require("../models/Poll");

// Create a new poll
const createPoll = async (req, res) => {
  try {
    const { question, options } = req.body;

    if (!question || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ message: "Invalid poll data" });
    }

    const newPoll = new Poll({
      question,
      options,
      votes: Object.fromEntries(options.map((opt) => [opt, 0])),
    });

    await newPoll.save();
    res.status(201).json(newPoll);
  } catch (error) {
    console.error("Error creating poll:", error);
    res.status(500).json({ message: "Failed to create poll" });
  }
};

// Get all polls
const getPolls = async (req, res) => {
  try {
    const polls = await Poll.find();
    res.json(polls);
  } catch (error) {
    console.error("Error fetching polls:", error);
    res.status(500).json({ message: "Failed to fetch polls" });
  }
};

// Vote on a poll
const votePoll = async (req, res) => {
  try {
    const { id } = req.params;
    const { option } = req.body;

    const poll = await Poll.findById(id);
    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    if (!poll.options.includes(option)) {
      return res.status(400).json({ message: "Invalid option" });
    }

    poll.votes[option] = (poll.votes[option] || 0) + 1;
    await poll.save();

    res.json(poll);
  } catch (error) {
    console.error("Error voting:", error);
    res.status(500).json({ message: "Failed to submit vote" });
  }
};

module.exports = { createPoll, getPolls, votePoll };

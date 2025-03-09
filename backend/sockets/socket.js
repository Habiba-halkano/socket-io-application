const Poll = require("../models/Poll");

const handleSockets = (io) => {
  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // Handle vote event
    socket.on("vote", async ({ pollId, option }) => {
      try {
        const poll = await Poll.findById(pollId);
        if (!poll) {
          console.error("Poll not found:", pollId);
          return;
        }

        // Find the index of the option in the poll's options
        const optionIndex = poll.options.findIndex(opt => opt.name === option);
        if (optionIndex === -1) {
          console.error("Option not found in poll:", option);
          return;
        }

        // Increment the vote count for the selected option
        poll.options[optionIndex].votes += 1;
        await poll.save();

        // Emit updated results for all polls
        const updatedPolls = await Poll.find();
        console.log("Emitting updated results:", updatedPolls);  // Debug log
        io.emit("pollResults", updatedPolls); // Emit updated list of all polls
      } catch (error) {
        console.error("Error updating vote:", error);
      }
    });

    // Handle client disconnect
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};

module.exports = { handleSockets };

const Poll = require("../models/Poll");

const handleSockets = (io) => {
  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("vote", async ({ pollId, option }) => {
      try {
        const poll = await Poll.findById(pollId);
        if (!poll) {
          console.error("Poll not found:", pollId);
          return;
        }

        const optionIndex = poll.options.findIndex(opt => opt.name === option);
        if (optionIndex === -1) {
          console.error("Option not found in poll:", option);
          return;
        }

        poll.options[optionIndex].votes += 1;
        await poll.save();

        const updatedPolls = await Poll.find();
        console.log("Emitting updated results:", updatedPolls);
        io.emit("pollResults", updatedPolls);
      } catch (error) {
        console.error("Error updating vote:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};

module.exports = { handleSockets };

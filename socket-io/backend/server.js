require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db.js");
const pollRoutes = require("./routes/pollRoutes");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// connect to db
connectDB();

// middleware
app.use(cors());
app.use(express.json());

app.use("/api/polls", pollRoutes);

// socket.io
io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("vote", (data) => {
        io.emit("voteUpdate", data);
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
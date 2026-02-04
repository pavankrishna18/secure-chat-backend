const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

// username → socketId (RAM only)
const users = {};

io.on("connection", socket => {

  socket.on("register", username => {
    users[username] = socket.id;
    socket.username = username;
  });

  socket.on("send-message", ({ to, payload }) => {
    if (users[to]) {
      io.to(users[to]).emit("receive-message", {
        from: socket.username,
        payload
      });
    }
  });

  socket.on("disconnect", () => {
    delete users[socket.username];
  });
});

server.listen(3000, () => {
  console.log("Secure chat server running on port 3000");
});

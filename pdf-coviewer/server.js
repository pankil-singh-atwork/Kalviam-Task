const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // React frontend URL
    methods: ["GET", "POST"]
  }
});

let currentPage = 1; // Keeps track of the current PDF page
let adminSocket = null; // Admin user connection

io.on("connection", (socket) => {
  console.log("New user connected");

  // Emit the current page to newly connected users
  socket.emit("pageChanged", currentPage);

  // Listen for 'setAdmin' to assign admin privileges
  socket.on("setAdmin", () => {
    adminSocket = socket;
  });

  // Listen for page changes from the admin user
  socket.on("changePage", (page) => {
    if (socket === adminSocket) {
      currentPage = page;
      io.emit("pageChanged", page); // Broadcast to all users
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    if (socket === adminSocket) {
      adminSocket = null; // Reset admin if the admin user disconnects
    }
    console.log("User disconnected");
  });
});

server.listen(4000, () => {
  console.log("Server running on port 4000");
});

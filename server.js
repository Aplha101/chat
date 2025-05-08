const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/login.html"); // First page is always sign-up
});
app.use(express.static("public"));

// Socket.IO setup
const users = {}; // ✅ Store usernames associated with socket IDs

io.on("connection", (socket) => {
    socket.on("userJoined", (username) => {
        users[socket.id] = username; // ✅ Save username with socket ID
        socket.broadcast.emit("systemMessage", `${username} has joined the chat`);
    });
    
socket.on("chat message", (msg) => {
    io.emit("chat message", msg); // ✅ Broadcast to all users
});

    socket.on("disconnect", () => {
        const username = users[socket.id]// ✅ Get username before they disconnect
        socket.broadcast.emit("userLeft", `${username} has left the chat`);
        delete users[socket.id]; // ✅ Remove user from tracking after they disconnect
    });
});



const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
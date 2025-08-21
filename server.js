const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/login.html"); 
});
app.use(express.static("public"));

// Socket.IO setup
const users = {};
io.on("connection", (socket) => {
    socket.on("userJoined", (username) => {
        users[socket.id] = username; 
        socket.broadcast.emit("systemMessage", `${username} has joined the chat`);
    });

    // ✅ Accept object instead of string
    socket.on("chat message", (data) => {
        // data = { username, message, pfp }
        io.emit("chat message", data); 
    });

    socket.on("disconnect", () => {
        const username = users[socket.id];
        if (username) {
            socket.broadcast.emit("userLeft", `${username} has left the chat`);
            delete users[socket.id];
        }
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
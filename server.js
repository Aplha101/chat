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

const users = {};

io.on("connection", (socket) => {
    socket.on("userJoined", (username) => {
        users[socket.id] = { username }; 
        io.emit("updateUserList", Object.values(users)); 
        socket.broadcast.emit("systemMessage", `${username} has joined the chat`);
    });

    socket.on("chat message", (data) => {
        io.emit("chat message", data);
    });

    socket.on("disconnect", () => {
        const user = users[socket.id];
        if (user) {
            socket.broadcast.emit("systemMessage", `${user.username} has left the chat`);
            delete users[socket.id];
            io.emit("updateUserList", Object.values(users)); // ✅ update user list after disconnect
        }
    });
});


const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
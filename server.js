const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const fs = require("fs");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/login.html"); 
});
app.use(express.static("public"));


const users = {};

const MESSAGES_FILE = path.join(__dirname, "messages.jsonl");
function loadMessages() {
    if (!fs.existsSync(MESSAGES_FILE)) return [];
    return fs.readFileSync(MESSAGES_FILE, "utf-8")
        .trim()
        .split("\n")
        .filter(line => line.trim() !== "") 
        .map(line => {
            try {
                return JSON.parse(line);
            } catch {
                return null; 
            }
        })
        .filter(m => m);
}

function saveMessage(message) {
    fs.appendFileSync(MESSAGES_FILE, JSON.stringify(message) + "\n");
}


let messages = loadMessages().slice(-100);

io.on("connection", (socket) => {
    socket.on("userJoined", (username) => {
        users[socket.id] = { username }; 
        io.emit("updateUserList", Object.values(users)); 
        socket.broadcast.emit("systemMessage", `${username} has joined the chat`);

        socket.emit("chatHistory", messages);
    });

    socket.on("chat message", (data) => {
        messages.push(data);
        if (messages.length > 100) messages.shift(); 
        saveMessage(data);

        io.emit("chat message", data);
    });

    socket.on("disconnect", () => {
        const user = users[socket.id];
        if (user) {
            socket.broadcast.emit("systemMessage", `${user.username} has left the chat`);
            delete users[socket.id];
            io.emit("updateUserList", Object.values(users)); 
        }
    });
});

function getFileSize(filePath) {
    if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        const bytes = stats.size;
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }
    return "File not found";
}

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log("file size:", getFileSize(MESSAGES_FILE));
});


const socket = io(); // Connect to server

const messageInput = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");
const chatBox = document.getElementById("chat-box");
const username = localStorage.getItem("username")// Get username from local storage or prompt user


sendBtn.addEventListener("click", () => {
    const message = messageInput.value.trim();
    if (message) {
        socket.emit("chat message", `${username} : ${message}`); // ✅ Send message
        messageInput.value = ""; // ✅ Clear input after sending
    }
});

// Send message to server
sendBtn.addEventListener("click", () => {
    const message = messageInput.value.trim();
    if (message) {
        socket.emit("chat message", `${username} : ${message}`); // Send message
        messageInput.value = ''; // Clear input after sending
    }
});

// Receive message from server & display it
socket.on("chat message", (msg) => {
    const messageElement = document.createElement("p");
    messageElement.textContent = msg;
    chatBox.appendChild(messageElement);

    chatBox.scrollTop = chatBox.scrollHeight; // ✅ Auto-scroll
});


messageInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        event.preventDefault(); 
        sendBtn.click(); 
    }
});


// ✅ Send username to server when connecting
socket.emit("userJoined", username);

// ✅ Listen for join/leave messages & show in chat
socket.on("systemMessage", (msg) => {
    const messageElement = document.createElement("p");
    messageElement.textContent = msg;
    messageElement.classList.add("system-message"); // Style system messages differently
    chatBox.appendChild(messageElement);
});

// ✅ Notify when a user leaves
socket.on("userLeft", (msg) => {
    const messageElement = document.createElement("p");
    messageElement.textContent = msg;
    messageElement.classList.add("system-message");
    chatBox.appendChild(messageElement);
});


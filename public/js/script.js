const socket = io(); // Connect to server

const messageInput = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");
const chatBox = document.getElementById("chat-box");
const username = localStorage.getItem("username")// Get username from local storage or prompt user


sendBtn.addEventListener("click", () => {
    const message = messageInput.value.trim();
    if (message) {
        socket.emit("chat message", `${username} : ${message}`); 
        messageInput.value = ""; 
    }
});

sendBtn.addEventListener("click", () => {
    const message = messageInput.value.trim();
    if (message) {
        socket.emit("chat message", `${username} : ${message}`); 
        messageInput.value = ''; 
    }
});

socket.on("chat message", (msg) => {
    const messageElement = document.createElement("p");
    messageElement.textContent = msg;
    chatBox.appendChild(messageElement);

    chatBox.scrollTop = chatBox.scrollHeight; 
});


messageInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        event.preventDefault(); 
        sendBtn.click(); 
    }
});


socket.emit("userJoined", username);

socket.on("systemMessage", (msg) => {
    const messageElement = document.createElement("p");
    messageElement.textContent = msg;
    messageElement.classList.add("system-message"); 
    chatBox.appendChild(messageElement);
});

// ✅ Notify when a user leaves
socket.on("userLeft", (msg) => {
    const messageElement = document.createElement("p");
    messageElement.textContent = msg;
    messageElement.classList.add("system-message");
    chatBox.appendChild(messageElement);
});


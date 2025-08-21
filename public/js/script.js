const socket = io(); // Connect to server

const messageInput = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");
const chatBox = document.getElementById("chat-box");

const username = localStorage.getItem("username") || "Guest";
const pfp = localStorage.getItem("pfp") || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

// ✅ Only ONE send handler
sendBtn.addEventListener("click", () => {
    const message = messageInput.value.trim();

    if (message) {
        socket.emit("chat message", {
            username: username,
            message: message,
            pfp: pfp
        });
        messageInput.value = '';
    }
});

// ✅ Render received messages
socket.on("chat message", (data) => {
    const { username, message, pfp } = data;

    const msgDiv = document.createElement("div");
    msgDiv.classList.add("chat-message");

    msgDiv.innerHTML = `
        <img src="${pfp}" alt="pfp" class="pfp" width="20" height="20" 
             style="border-radius:50%; margin-right:5px; ">
        <strong>${username}:</strong> ${message}
    `;

    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
});

messageInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        sendBtn.click();
    }
});

// System messages
socket.emit("userJoined", username);

socket.on("systemMessage", (msg) => {
    const messageElement = document.createElement("p");
    messageElement.textContent = msg;
    messageElement.classList.add("system-message"); 
    chatBox.appendChild(messageElement);
});

socket.on("userLeft", (msg) => {
    const messageElement = document.createElement("p");
    messageElement.textContent = msg;
    messageElement.classList.add("system-message");
    chatBox.appendChild(messageElement);
});

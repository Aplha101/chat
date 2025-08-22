const socket = io(); 
const messageInput = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");
const chatBox = document.getElementById("chat-box");

const username = localStorage.getItem("username") || "Guest";
const pfp = localStorage.getItem("pfp") || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";


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

socket.on("chat message", (data) => {
    const { username, message, pfp } = data;

    const msgDiv = document.createElement("div");
    msgDiv.classList.add("chat-message");

msgDiv.innerHTML = `
    <img src="${pfp}" alt="pfp" class="pfp" width="30" height="30" 
         style="border-radius:50%; margin-right:5px;">
    <a href="#" 
       class="chat-username" 
       data-user='${JSON.stringify({ username , pfp })}'
       style="text-decoration:none; color:#4da6ff; font-weight:bold;">
        ${username}
    </a>: ${message}
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

chatBox.addEventListener("click", (e) => {
    if (e.target.classList.contains("chat-username")) {
        const userData = JSON.parse(e.target.getAttribute("data-user"));
        window.location.href = "userClick.html";
    }
});


const onlineUsersEl = document.getElementById("online-users");

// Listen for user list updates
socket.on("updateUserList", (users) => {
    console.log(users)
    if (users.length === 0) {
        onlineUsersEl.textContent = "No users online";
    } else {
        onlineUsersEl.textContent = "Online: " + users.map(u => u.username).join(", ");
    }
});

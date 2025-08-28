const socket = io(); 
const messageInput = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");
const chatBox = document.getElementById("chat-box");

const username = localStorage.getItem("username") || "Guest";
const pfp = localStorage.getItem("pfp") || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
const dateJoined = localStorage.getItem("dateJoined") ;
sendBtn.addEventListener("click", () => {
    const message = messageInput.value.trim();

    if (message) {
        socket.emit("chat message", {
            username: username,
            message: message,
            pfp: pfp,
            dateJoined: dateJoined
        });
        messageInput.value = '';
    }
});

socket.on("chat message", (data) => {
    if (!data || !data.username || !data.message || !data.pfp) {
        console.warn("Skipped invalid message:", data);
        return; // 🚀 Don’t render broken messages
    }

    const { username, message, pfp , dateJoined} = data;

    const msgDiv = document.createElement("div");
    msgDiv.classList.add("chat-message");

    msgDiv.innerHTML = `
        <img src="${pfp}" alt="pfp" class="pfp" width="40" height="40" 
             style="border-radius:50%; margin-right:5px;">
        <a href="#" 
           class="chat-username" 
           data-user='${JSON.stringify({ username , pfp , dateJoined })}'
           style="text-decoration:none; color:#4da6ff; font-weight:bold;">
            ${username}
        </a>: ${message}
    `;

    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
});


socket.on("chatHistory", (messages) => {
    messages.forEach((data) => {
        const { username, message, pfp, dateJoined } = data;

        const msgDiv = document.createElement("div");
        msgDiv.classList.add("chat-message");

        msgDiv.innerHTML = `
            <img src="${pfp}" alt="pfp" class="pfp" width="40" height="40" 
                 style="border-radius:50%; margin-right:5px;">
            <a href="#" 
               class="chat-username" 
               data-user='${JSON.stringify({ username, pfp, dateJoined })}'
               style="text-decoration:none; color:#4da6ff; font-weight:bold;">
                ${username}
            </a>: ${message}
        `;
        chatBox.appendChild(msgDiv);
    });

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
        const oldInfo = document.querySelector(".userinfo");
        if (oldInfo) oldInfo.remove();


        const userinfoDiv = document.createElement("div");
        userinfoDiv.classList.add("userinfo");

        userinfoDiv.innerHTML = `
            <!-- Header -->
            <div class="userinfo-header">
                <span class="userinfo-username">${userData.username}</span>
                <a  class="userinfo-close">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" 
                       fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 
                             7.293l2.646-2.647a.5.5 0 0 1 
                             .708.708L8.707 8l2.647 
                             2.646a.5.5 0 0 1-.708.708L8 
                             8.707l-2.646 
                             2.647a.5.5 0 0 1-.708-.708L7.293 
                             8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                  </svg>
                </a>
            </div>

            <!-- Body -->
            <div class="userinfo-body">
                <img src="${userData.pfp}" alt="Profile Picture" 
                     class="userinfo-pfp" />
                <div class="userinfo-buttons">
                    <p class='dateJoined'> Joined : ${userData.dateJoined}</p>
                    <button class="circle-btn"></button>
                    <button class="circle-btn"></button>
                    <button class="circle-btn"></button>
                </div>
            </div>
        `;

        chatBox.appendChild(userinfoDiv);
        userinfoDiv.querySelector(".userinfo-close").addEventListener("click", (ev) => {
            ev.preventDefault();
            userinfoDiv.remove();
        });
    }
});


const onlineUsersEl = document.getElementById("online-users");


socket.on("updateUserList", (users) => {
    if (users.length === 0) {
        onlineUsersEl.textContent = "No users online";
    } else {
        onlineUsersEl.textContent = "Online: " + users.map(u => u.username).join(", ");
    }
});


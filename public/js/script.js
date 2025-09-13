const socket = io(); 
const messageInput = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");
const chatBox = document.getElementById("chat-box");

const username = localStorage.getItem("username") || "Guest";
const pfp = localStorage.getItem("pfp") || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
const dateJoined = localStorage.getItem("dateJoined") ;
sendBtn.addEventListener("click", () => {
    const message = messageInput.value.trim();
    const msglim = document.getElementById("msglim");

  

    if (message && message.length <= 100) {
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
        return; 
    }
    const { username, message, pfp , dateJoined} = data;

    const msgDiv = document.createElement("div");
    msgDiv.classList.add("chat-message");

    msgDiv.innerHTML = `
<div class="msgCont">
  <img src="${pfp}" alt="pfp" class="pfp" width="40" height="40" style="border-radius:50%; margin-right:5px;">
  
  <div class="msgContent">
    <a href="#"
       class="chat-username"
       data-user='${JSON.stringify({ username , pfp , dateJoined })}'
       style="text-decoration:none; color:#4da6ff; font-weight:bold;">
        ${username}
    </a>: ${message}

    <!-- buttons (hidden until hover) -->
    <div class="msgActions">
      <button id='copy'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard-fill" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M10 1.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5zm-5 0A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5v1A1.5 1.5 0 0 1 9.5 4h-3A1.5 1.5 0 0 1 5 2.5zm-2 0h1v1A2.5 2.5 0 0 0 6.5 5h3A2.5 2.5 0 0 0 12 2.5v-1h1a2 2 0 0 1 2 2V14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3.5a2 2 0 0 1 2-2"/>
</svg></button>
      <button id='reply'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-reply-fill" viewBox="0 0 16 16">
  <path d="M5.921 11.9 1.353 8.62a.72.72 0 0 1 0-1.238L5.921 4.1A.716.716 0 0 1 7 4.719V6c1.5 0 6 0 7 8-2.5-4.5-7-4-7-4v1.281c0 .56-.606.898-1.079.62z"/>
</svg></button>
      <button id='del'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
  <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
</svg></button>
    </div>
  </div>
</div>

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
                <div class="msgActions">
      <button 
      onclick="navigator.clipboard.writeText('${message}')"
      
      id='copy'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard-fill" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M10 1.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5zm-5 0A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5v1A1.5 1.5 0 0 1 9.5 4h-3A1.5 1.5 0 0 1 5 2.5zm-2 0h1v1A2.5 2.5 0 0 0 6.5 5h3A2.5 2.5 0 0 0 12 2.5v-1h1a2 2 0 0 1 2 2V14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3.5a2 2 0 0 1 2-2"/>
</svg></button>
      <button id='reply'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-reply-fill" viewBox="0 0 16 16">
  <path d="M5.921 11.9 1.353 8.62a.72.72 0 0 1 0-1.238L5.921 4.1A.716.716 0 0 1 7 4.719V6c1.5 0 6 0 7 8-2.5-4.5-7-4-7-4v1.281c0 .56-.606.898-1.079.62z"/>
</svg></button>
      <button id='del'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
  <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
</svg></button>
    </div>
  </div>
</div>
        `;
        chatBox.appendChild(msgDiv);
    });

    chatBox.scrollTop = chatBox.scrollHeight;
});


messageInput.addEventListener("keypress", (event) => {
       if(event.key === "Enter" && event.shiftKey){
        messageInput.value += "\n";
    }
    else if (event.key === "Enter") {
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
                    <button class="circle-btn"  id='addFriend'></button>
                    <button class="circle-btn" id='removeFriend'></button>
                    <button class="circle-btn" id='MessageUser'></button>
                </div>
            </div>
        `;

        chatBox.appendChild(userinfoDiv);
        userinfoDiv.querySelector(".userinfo-close").addEventListener("click", (ev) => {
            ev.preventDefault();
            userinfoDiv.remove();
        });
        $('#addFriend').click(() => {
            
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


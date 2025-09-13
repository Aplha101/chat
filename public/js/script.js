const socket = io(); 
const messageInput = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");
const chatBox = document.getElementById("chat-box");
const username = localStorage.getItem("username") || "Guest";
const pfp = localStorage.getItem("pfp") || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
const dateJoined = localStorage.getItem("dateJoined") ;
const email = localStorage.getItem("email");
const id = localStorage.getItem("id");
const Friends = localStorage.getItem("Friends") || "";

sendBtn.addEventListener("click", () => {
    const message = messageInput.value.trim();
    if (message && message.length <= 100) {
        socket.emit("chat message", {
            username: username,
            message: message,
            pfp: pfp,
            email: email,
            id: id,
             Friends: Friends,
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
    const { username, message, pfp , dateJoined , email, id , Friends} = data;

    const msgDiv = document.createElement("div");
    msgDiv.classList.add("chat-message");

    msgDiv.innerHTML = `
<div class="msgCont">
  <img src="${pfp}" alt="pfp" class="pfp" width="40" height="40" style="border-radius:50%; margin-right:5px;">
  
  <div class="msgContent">
    <a href="#"
       class="chat-username"
       data-user='${JSON.stringify({ username , pfp , dateJoined , email, id , Friends})}'
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
        const { username, message, pfp, dateJoined , email, id, Friends} = data;

        const msgDiv = document.createElement("div");
        msgDiv.classList.add("chat-message");

        msgDiv.innerHTML = `
            <img src="${pfp}" alt="pfp" class="pfp" width="40" height="40" 
                 style="border-radius:50%; margin-right:5px;">
            <a href="#" 
               class="chat-username" 
               data-user='${JSON.stringify({ username, pfp, dateJoined, email, id, Friends })}'
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
        console.log(userData)
        const oldInfo = document.querySelector(".userinfo");
        if (userData.id === id) {
            return;
        }

        if (oldInfo) oldInfo.remove();


        const userinfoDiv = document.createElement("div");
        userinfoDiv.classList.add("userinfo");

        userinfoDiv.innerHTML = `
            <div class="userinfo-header">
  <span class="userinfo-username">${userData.username}</span>
  <span class="userinfo-close">&times;</span>
</div>

<div class="userinfo-body">
  <img src="${userData.pfp}" alt="pfp" class="userinfo-pfp">
  <div>
    <p class="userinfo-status">Joined: ${userData.dateJoined}</p>
  </div>
</div>

<div class="userinfo-buttons">
  <button class="action-btn" id="addFriend">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" 
         fill="currentColor" class="bi bi-person-plus-fill" viewBox="0 0 16 16">
      <path d="M1 14s-1 0-1-1 1-4 6-4 6 
               3 6 4-1 1-1 1zm5-6a3 3 0 1 
               0 0-6 3 3 0 0 0 0 6"/>
      <path fill-rule="evenodd" d="M13.5 5a.5.5 0 0 
               1 .5.5V7h1.5a.5.5 0 0 1 0 
               1H14v1.5a.5.5 0 0 1-1 
               0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 
               0 0 1 .5-.5"/>
    </svg>
    Add Friend
  </button>
  
  <button class="action-btn" id="removeFriend">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" 
         fill="currentColor" class="bi bi-person-dash-fill" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M11 7.5a.5.5 0 0 
               1 .5-.5h4a.5.5 0 0 1 0 
               1h-4a.5.5 0 0 1-.5-.5"/>
      <path d="M1 14s-1 0-1-1 1-4 6-4 
               6 3 6 4-1 1-1 1zm5-6a3 
               3 0 1 0 0-6 3 3 0 0 
               0 0 6"/>
    </svg>
    Remove Friend
  </button>
  
  <button class="action-btn" id="MessageUser">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" 
         fill="currentColor" class="bi bi-chat-dots-fill" viewBox="0 0 16 16">
      <path d="M16 8c0 3.866-3.582 7-8 
               7a9 9 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 
               1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 
               11.37 0 9.76 0 8c0-3.866 3.582-7 
               8-7s8 3.134 8 7M5 8a1 1 0 
               1 0-2 0 1 1 0 0 0 2 0m4 
               0a1 1 0 1 0-2 0 1 1 0 0 
               0 2 0m3 1a1 1 0 1 0 0-2 
               1 1 0 0 0 0 2"/>
    </svg>
    Message
  </button>
</div>

        `;

        chatBox.appendChild(userinfoDiv);
        userinfoDiv.querySelector(".userinfo-close").addEventListener("click", (ev) => {
            ev.preventDefault();
            userinfoDiv.remove();
        });
        $('#addFriend').click(() => {
            let f = Friends.split(",");
            if(userData.id in f) {
                alert("User is already your friend!");
            }
            else{
                f.push(userData.id);
                 axios.delete(`https://sheetdb.io/api/v1/0qhgmvc12pifg/Email/${email}`);
                axios.post('https://sheetdb.io/api/v1/0qhgmvc12pifg', {
                    "data": {
                        "Username": username,
                        "Email": email,
                        "Password": localStorage.getItem("password"),
                        "pfp": pfp,
                        "DateJoined": dateJoined,
                        "Friends": f.toString()
                    }
                });
                localStorage.setItem("Friends", f.toString());
                alert("Friend added!");
            }
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


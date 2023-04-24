const chatForm = document.querySelector("#chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.querySelector("#room-name");
const usersList = document.querySelector("#users");

// Get username and room name
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Joining chat room
socket.emit("joinRoom", { username, room });

// get users and room name
socket.on("roomUsers", ({ room, users }) => {
  displayRoomName(room);
  displayOnlineUsers(users);
});

socket.on("message", (message) => {
  renderMessage(message);

  //   Scroll down auto
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const message = event.target.elements.msg.value;

  //   Emit message to server
  socket.emit("chatMessage", message);

  //   Clear
  event.target.elements.msg.value = "";
  event.target.elements.msg.focus();
});

// output to message view
function renderMessage(message) {
  console.log(message);
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `
        <p class="meta">${message.username} <span>${message.time}</span></p>
        <p class="text">
           ${message.text}
        </p>
    `;

  document.querySelector(".chat-messages").appendChild(div);
}

function displayRoomName(room) {
  roomName.textContent = room;
}

function displayOnlineUsers(users) {
  usersList.innerHTML = `
    ${users.map((user) => `<li>${user.username}</li>`).join("")}
    `;
}

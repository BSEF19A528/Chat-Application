//const socket = io("http://localhost:8000");
const socket = io("http://localhost:8000", { transports: ["websocket"] });

const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container"); //jab bhi messages aye gye woh container me daalne ha.
var audio = new Audio("audio.mp3");

//will write a function which will append "somebody joined the chat" in the messageContainer.
const append = (message, position) => {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageElement.classList.add("message");
  messageElement.classList.add(position);
  messageContainer.append(messageElement);
  if (position === "left") {
    audio.play();
  }
};

//now will emit an event named send message to server
form.addEventListener("submit", (e) => {
  e.preventDefault(); //page reload na ho
  const message = messageInput.value;
  append(`You: ${message}`, "right");
  socket.emit("send", message);
  messageInput.value = ""; //message field ko empty karne ke lye.
});

const name = prompt("Enter your name to join", "unknow user");

//emit new user joined event.
socket.emit("new-user-joined", name);

//now will handle/listen the user-joined event emitted by the server.
socket.on("user-joined", (name) => {
  append(`${name} joined the chat.`, "right");
});

//now will handle/listen the receive event emitted by the server.
socket.on("receive", (data) => {
  append(`${data.name} : ${data.message}`, "left");
});

//now will handle/listen the left event emitted by the server.
socket.on("left", (name) => {
  append(`${name} left the chat.`, "right");
});

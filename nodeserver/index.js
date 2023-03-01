//Node server that will handle socket to io connections

const io = require("socket.io")(8000);

const users = {};

io.on("connection", (socket) => {
  //new-user-joined event.
  socket.on("new-user-joined", (name) => {
    users[socket.id] = name; //when ever new-user-joined event will occur it will set name in the users{}

    //Now if 5 people are chatting and 6th comes then rest of 5 should also know that he has joined the chat so:
    socket.broadcast.emit("user-joined", name); //broadcast emits event to all the users except the one who just joined the chat. and will send them that user joined along with his anme
  });

  //If someone is sending message then this event will occur.
  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      name: users[socket.id],
    });
  });

  //if someone leaves the chat2
  socket.on("disconnect", (message) => {
    socket.broadcast.emit("left", users[socket.id]);
    delete users[socket.id]; //deleting that user from users
  });
});

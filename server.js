import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static("public"));

io.on("connection", function(socket){
  socket.on("newuser", function (username) {
    socket.broadcast.emit("update", username + " Joined the conversation");
  });
  socket.on("exituser", function (username) {
    socket.broadcast.emit("update", username + " left the conversation");
  });
  socket.on("chat", function (message) {
    socket.broadcast.emit("chat", message);
  });
});

// app.get("/",(req,res)=>{
//   res.sendFile("public/index.html");
// });

const PORT = process.env.PORT || 3000;
server.listen(PORT, console.log(`Server is running on port ${PORT}`));
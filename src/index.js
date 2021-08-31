const path = require('path');
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use('/', express.static(path.join(__dirname, '..', 'dist')));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

io.on("connection", (socket) => {
  console.log("a user connected");
});

http.listen(3000, () => {
  console.log("listening on *:3000");
});

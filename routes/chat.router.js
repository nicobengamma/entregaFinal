const express = require("express");
const { Router } = express;
const routerChat = Router();
const options = require("../options/db_sqlite");
const knex = require("knex")(options);
const http = require("http");
const { Server } = require("socket.io");

routerChat.use(express.json());
routerChat.use(express.urlencoded({ extended: "true" }));

const server = http.createServer(routerChat);
const io = new Server(server);

routerChat.get("/", (req, res) => {
  res.render("chats.ejs");
});

routerChat.get("/data", (req, res) => {
  knex
    .from("chats")
    .select("*")
    .then((rows) => {
      res.json(rows);
    });
});

io.on("connection", (socket) => {
  socket.on("chat-in", (data) => {
    const time = new Date().toLocaleTimeString();
    const dataOut = {
      msj: data.msj,
      userName: data.userName,
      time,
    };
    knex("chats")
      .insert(dataOut)
      .then(() => console.log("se enviaron los chats"))
      .catch((e) => console.log(e));
    io.sockets.emit("chat-out", dataOut);
  });
  socket.on("tiping", (userName) => {
    // const tiping = { tiping: userName };
    // fs.writeFileSync("tipingNow/tipingNow.json", JSON.stringify(tiping));
    socket.broadcast.emit("tiping", userName);
  });
});

server.listen(3000, () => {
  console.log("Running...");
});

module.exports = routerChat;

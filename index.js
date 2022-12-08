const express = require("express");
const cookieParser = require("cookie-parser");
const routerCarrito = require("./routes/carrito.router");
const routerProducts = require("./routes/products.router");
const routerUser = require("./routes/user.router");
const routerInfo = require("./routes/info.router");
const { auth } = require("./services/verifyToken");
const options = require("./options/db_sqlite");
const knex = require("knex")(options);
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = new Server(server);
require("dotenv").config({ path: "config.env" });

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: "true" }));
app.use("/public", express.static(__dirname + "/public"));

// Routes //

app.use("/api/session", routerUser);
app.use("/api/carrito", routerCarrito);
app.use("/api/products", routerProducts);
app.use("/info", routerInfo);
// app.use("/api/chat", routerChat);
app.get("/", (req, res) => {
  res.send("ok");
});

// PORT //
app.get("/api/chat", (req, res) => {
  res.render("chats.ejs");
});

app.get("/data", (req, res) => {
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
    socket.broadcast.emit("tiping", userName);
  });
});

server.listen(8080, () => {
  console.log("Running...");
});

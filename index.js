const express = require("express");
const cookieParser = require("cookie-parser");
const routerCarrito = require("./routes/carrito.router");
const routerProducts = require("./routes/products.router");
const routerUser = require("./routes/user.router");
const routerInfo = require("./routes/info.router");
const routerChat = require("./routes/chat.router");
const { auth } = require("./services/verifyToken");
require("dotenv").config({ path: "config.env" });

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: "true" }));

// Routes //

app.use("/api/session", routerUser);
app.use("/api/carrito", routerCarrito);
app.use("/api/products", routerProducts);
app.use("/info", routerInfo);
app.use("/api/chat", routerChat);
app.get("/", (req, res) => {
  res.send("ok");
});

// PORT //

app.listen(process.env.PORT, () => {
  console.log(`app listen on ${process.env.PORT}`);
});

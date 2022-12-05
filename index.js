const express = require("express");
const session = require("express-session");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const cookieParser = require("cookie-parser");
// const routerCarrito = require("./routes/carrito.router");
// const routerProducts = require("./routes/products.router");
const routerUser = require("./routes/user.router");
const routerInfo = require("./routes/info.router");
const verifyToken = require("./routes/validate-token");
require("dotenv").config({ path: "config.env" });

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: "true" }));

// Routes //

app.use("/api/sesion", routerUser);
// app.use("/api/carrito", routerCarrito);
// app.use("/api/products", verifyToken ,routerProducts);
app.use("/info", routerInfo);
app.get("/", (req, res) => {
  res.send("ok");
});

// PORT //

app.listen(process.env.PORT, () => {
  console.log(`app listen on ${process.env.PORT}`);
});

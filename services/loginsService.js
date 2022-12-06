const { client, uri } = require("../services/server");
const usuarios = client.db("myFirstDatabase").collection("logins");
const Logins = require("../models/schema.logins");
const bcrypt = require("bcrypt");
const logger = require("../config/log4js");
const mongoose = require("mongoose");
const { generateToken } = require("./verifyToken");

const registrar = (input, res) => {
  const { usuario, password } = input;
  usuarios.findOne({ usuario: usuario }).then((r) => {
    if (!r) {
      mongoose.connect(uri, {}, (err) => {
        if (err) {
          logger.warn(err);
        }
      });
      bcrypt.hash(password, 12).then(function (hashedPassword) {
        const nUsuario = new Logins({
          usuario: usuario,
          password: hashedPassword,
        });
        nUsuario.save().then((r) => console.log(r));
        res.send("Bienvenido");
      });
    } else {
      res.send("<h1>El Usuario Ya existe, Intente con otro !</h1>");
    }
  });
};
const login = (input, res) => {
  const { usuario, password } = input;
  usuarios.findOne({ usuario: usuario }).then((r) => {
    if (r) {
      mongoose.connect(uri, {}, (error) => {
        if (error) {
          console.log(error);
        }
      });
      bcrypt.compare(password, r.password);
      const user = usuario;
      const token = generateToken(user);
      res.header(token).redirect("/api/products");
    }
  });
};
module.exports = { registrar, login };

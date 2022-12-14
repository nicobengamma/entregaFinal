const jwt = require("jsonwebtoken");

// middleware to validate token (rutas protegidas)
function auth(req, res, next) {
  const authHeader = req.headers.token;

  if (!authHeader) return res.status(401).json("no auth");
  jwt.verify(authHeader, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json("error auth");

    req.user = decoded.data;
    next();
  });
}
function generateToken(user) {
  const data = {
    username: user,
    rol: user,
  };
  return jwt.sign({ data }, process.env.TOKEN_SECRET, { expiresIn: "24h" });
}

module.exports = { auth, generateToken };

const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    jwt.verify(token, process.env.key, (err, decoded) => {
      if (decoded) {
       
        req.body.userId = decoded.userId;
        req.body.username = decoded.username;
        console.log("decode",decoded)
        next();
      } else {
        res.send({ message: "You are not authorized" });
      }
    });
  } else {
    res.send({ message: "Please Login First!" });
  }
};

module.exports = { auth };

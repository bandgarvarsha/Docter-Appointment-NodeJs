const jwt = require("jsonwebtoken");

const { secretKey } = require("./config");

const auth = (req, res, next) => {
  console.log("Auth");
  console.log(secretKey);
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, secretKey, (err, data) => {
      if (err) {
        res.sendStatus(403);
      }
      req.data = data;
    });
    next();
  } else {
    res.sendStatus(401);
  }
};

module.exports = auth;

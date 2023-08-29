const express = require("express");
const jwt = require("jsonwebtoken");
const { secretKey } = require("../Auth/config");
const cors = require("cors");
// const auth = require("../Auth/auth");

const app = express();
app.use(express.json());

const corsOptions = {
  origin: "*",
  methods: "GET,POST",
  allowedHeaders: "Content-Type,Authorization",
};
app.use(cors(corsOptions));
const PORT = 5000;

const users = [
  {
    emailId: "bandgarvarsha@gmail.com",
    password: "abc123",
    role: "user",
  },
  {
    emailId: "vijay@gmail.com",
    password: "abc123",
    role: "admin",
  },
];

app.post("/login", (req, res) => {
  const { emailId, password } = req.body;
  const user = users.find((usr) => {
    return usr.emailId === emailId && usr.password === password ? usr : false;
  });

  if (user) {
    const authToken = jwt.sign(
      { emailId: user.emailId, role: user.role },
      secretKey
    );
    res.send({ Token: authToken, user });
  } else {
    res.send("Email and Password invalid");
  }
});

const registeredUsers = [];

const isExists = (emailId) => {
  return registeredUsers.some((user) => user.emailId === emailId);
};

const isValidEmail = (emailId) => {
  let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let test = emailRegex.test(emailId);
  console.log(test);
  return test;
};

app.post("/signup", (req, res) => {
  const { fullName, address, mobileNo, emailId, password } = req.body;

  if (!fullName || !address || !mobileNo || !emailId || !password) {
    res.send({ status: 400, message: "All fields are required" });
  } else if (!isValidEmail(emailId)) {
    res.send({ status: 409, message: "Email Not Valid" });
  } else if (isExists(emailId)) {
    res.send({ status: 409, message: "Email already exists" });
  } else if (!mobileNo) {
    res.send({ status: 409, message: "Mobile number is not valid" });
  } else {
    registeredUsers.push({
      fullName,
      address,
      mobileNo,
      emailId,
      password,
    });
    return res.send({ status: 200, message: "User Registred.." });
  }
});

app.get("/doctorList", (req, res, next) => {
  let doctorList = [
    {
      id: 1,
      name: "varsha",
    },
    {
      id: 2,
      name: "vijay",
    },
    {
      id: 3,
      name: "arnav",
    },
  ];
  console.log(req.user);
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, secretKey, (err, data) => {
      if (err) {
        res.sendStatus(403);
      }
      res.send({ status: 200, data: doctorList, message: "Authorized User" });
    });
    next();
  } else {
    res.sendStatus(401);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

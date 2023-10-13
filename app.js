const express = require("express");
const cors = require("cors");
const { connectDb } = require("./database/index");

const app = express();
app.use(express.json());

connectDb();
const userAuthRoutes = require("./Users/authRoutes");
const docterAuthRoutes = require("./Docters/authRoutes");
const userRoutes = require("./Users/userRoutes");
const docterRoutes = require("./Docters/docterRoutes");

app.use("/Users/auth", userAuthRoutes);
app.use("/Docters/auth", docterAuthRoutes);
app.use("/Users", userRoutes);
app.use("/Docters", docterRoutes);

const corsOptions = {
  origin: "*",
  methods: "GET,POST",
  allowedHeaders: "Content-Type,Authorization",
};
app.use(cors(corsOptions));

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

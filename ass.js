const express = require("express");
const app = express();
app.use(express.json());

const PORT = 3000;

app.post("/about", (req, res) => {
  const name = {
    firstName: "Varsha",
  };
  res.send(name);
});

app.get("/info", (req, res) => {
  const info = {
    lastName: "bandgar",
  };
  res.send(info);
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

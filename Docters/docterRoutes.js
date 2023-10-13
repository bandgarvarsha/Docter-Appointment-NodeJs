const express = require("express");
const router = express.Router();

router.get("/doctorList", async (req, res) => {
  const db = client.db("docter");
  const collection = db.collection("docterRegistration");

  const col = await collection.find().toArray();
  console.log("col", col);
  res.send(col);
});

router.get("/docterProfile/:id", async (req, res) => {
  const db = client.db("docter");
  const collection = db.collection("docterRegistration");

  const id = req.params.id.trim();
  //console.log("id", id);
  await collection
    .findOne({ _id: new ObjectId(id) })
    .then((response) => {
      console.log(response);
      res.send(response);
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;

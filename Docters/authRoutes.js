const express = require("express");
const router = express.Router();

router.post("/docterRegistration", (req, res) => {
  res.send(req.body);
  const {
    id,
    fullName,
    education,
    speciality,
    address,
    phoneNumber,
    experience,
    information,
    emailId,
    password,
  } = req.body;
  async function createDocument(databaseName, collectionName, document) {
    const db = client.db(databaseName);
    const collection = db.collection(collectionName);

    try {
      const result = await collection.insertOne(document);
      console.log("Document inserted", result.insertedId);
      console.log(result);
    } catch (error) {
      console.log("Error", error);
    }
  }
  createDocument("docter", "docterRegistration", {
    fullName,
    education,
    speciality,
    address,
    phoneNumber,
    experience,
    information,
    emailId,
    password,
  });
});

router.post("/docterLogin", async (req, res) => {
  const { emailId, password } = req.body;

  const db = client.db("docter");
  const collection = db.collection("docterRegistration");

  await collection
    .findOne({ emailId: emailId, password: password })
    .then((response) => {
      if (response) {
        const authToken = jwt.sign(
          {
            emailId: response.emailId,
            role: response.role,
          },
          secretKey
        );

        console.log("Response", response);

        let user = {
          Token: authToken,
          fullName: response.fullName,
          id: response._id,
        };
        res.send(user);
      } else {
        res.status(401).send({ message: "Invalid credientials" });
      }
    })
    .catch((err) => {
      res.send(err.message);
    });
});

module.exports = router;

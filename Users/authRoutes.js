const express = require("express");
const router = express.Router();

router.post("/login", async (req, res) => {
  const { emailId, password } = req.body;

  const db = client.db("docter");
  const collection = db.collection("registration");

  await collection
    .findOne({ emailId: emailId, password: password })
    .then((response) => {
      if (response) {
        const authToken = jwt.sign(
          {
            emailId: response.emailId,
            role: response.role,
            // exp: Math.floor(Date.now() / 1000) + 10 * 60,
          },
          secretKey
        );
        console.log(response);
        let user = {
          Token: authToken,
          fullName: response.fullName,
          id: response._id,
        };
        res.send(user);
      } else {
        res.status(401).send({ message: "Invalid credientials" });

        //throw new Error("Invalid credientials", 401);
      }
    })
    .catch((err) => {
      console.log("Error", err);
      res.send(err.message);
    });
});

const isExists = async (emailId) => {
  const db = client.db("docter");
  const collection = db.collection("registration");
  const count = await collection.countDocuments({ emailId: emailId });
  const emailCount = count > 0 ? true : false;
  return emailCount;
};

// select countClick

const isValidEmail = (emailId) => {
  let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let test = emailRegex.test(emailId);
  return test;
};

router.post("/signup", async (req, res) => {
  const { id, fullName, address, mobileNo, emailId, password } = req.body;
  console.log(await isExists(emailId));
  if (!fullName || !address || !mobileNo || !emailId || !password) {
    res.status(400).send({ message: "All fields are required" });
  } else if (!isValidEmail(emailId)) {
    res.status(409).send({ message: "Email Not Valid" });
  } else if (await (!id && isExists(emailId))) {
    res.status(409).send({ message: "Email already exists" });
  } else if (!mobileNo) {
    res.status(409).send({ message: "Mobile number is not valid" });
  }
  // } else {
  //   if (id) {
  //     /* author : varsha
  //       task:Update user by Id
  //     */

  //     return res.send({ status: 200, message: "User updated.." });
  //   }
  else {
    //logic for create new user
    async function createDocument(databaseName, collectionName, document) {
      const db = client.db(databaseName);
      const collection = db.collection(collectionName);

      try {
        const result = await collection.insertOne(document);
        console.log("Document inserted:", result.insertedId);
        console.log(result);
      } catch (error) {
        console.error("Error inserting document:", error);
      }
    }

    // Usage
    createDocument("docter", "registration", {
      fullName,
      address,
      mobileNo,
      emailId,
      password,
    });

    return res.send({ status: 200, message: "User Registred.." });
  }
});

module.exports = router;

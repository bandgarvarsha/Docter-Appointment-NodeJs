const express = require("express");
const jwt = require("jsonwebtoken");
const { secretKey } = require("./Auth/config");
const cors = require("cors");
const auth = require("./Auth/auth");
const doctersList = require("./doctorsList.json");
const timeSlots = require("./Auth/timeSlots.json");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
app.use(express.json());

const url =
  "mongodb+srv://bandgarvarsha123:Wz3euzppPOVuqt19@cluster0.mynuvqs.mongodb.net/";
const client = new MongoClient(url, {
  useNewUrlParser: true,
  //useUnifiedTopology: true,
});

const connectDb = async () => {
  try {
    await client.connect();
    console.log("Connected to the databse");
  } catch (err) {
    console.log(err);
  }
};

connectDb();

const corsOptions = {
  origin: "*",
  methods: "GET,POST",
  allowedHeaders: "Content-Type,Authorization",
};
app.use(cors(corsOptions));
const PORT = 5000;

app.post("/login", async (req, res) => {
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

app.post("/signup", async (req, res) => {
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
  } else {
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

app.get("/doctorList", async (req, res) => {
  const db = client.db("docter");
  const collection = db.collection("docterRegistration");

  const col = await collection.find().toArray();
  console.log("col", col);
  res.send(col);
});

app.get("/searchDocter", (req, res) => {
  res.send(doctersList);
});

app.get("/docterProfile/:id", async (req, res) => {
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

//fetchUserById

app.get("/updateUserProfile/:id", async (req, res) => {
  const db = client.db("docter");
  const collection = db.collection("registration");

  const id = req.params.id.trim();

  console.log("id", id);
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

app.post("/docterRegistration", (req, res) => {
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

app.post("/docterLogin", async (req, res) => {
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

/*
getting docters slot
payload {did,date}
*/

app.post("/saveSlots", (req, res) => {
  const { docterId, sDate, selectedSlots } = req.body;

  const dId = new ObjectId(docterId);
  async function createDocument(databaseName, collectionName, document) {
    const db = client.db(databaseName);
    const collection = db.collection(collectionName);

    try {
      const slotCount = await collection.countDocuments({
        // check exixst or not
        dId: new ObjectId(dId),
        sDate,
      });
      console.log("REs", res);

      if (slotCount > 0) {
        const updateSlot = await collection.updateOne(
          // used to update the slots
          { dId: new ObjectId(dId), sDate },
          { $set: { selectedSlots: selectedSlots } }
        );
        res.status(200).send({ message: "Slots saved." });
      } else {
        const result = await collection.insertOne(document);
        console.log("Document inserted", result.insertedId);
        console.log(result);
      }
    } catch (error) {
      console.log("Error", error);
    }
  }
  createDocument("docter", "availableSlots", {
    dId,
    sDate,
    selectedSlots,
  });
  console.log(sDate, selectedSlots);
});

app.get("/allSlots/:id/:date", async (req, res) => {
  console.log("TimeSlots : ", timeSlots);
  const db = client.db("docter");
  const collection = db.collection("availableSlots");
  const id = req.params.id.trim();
  const date = req.params.date;

  console.log("Id", id);

  const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
  if (!isValidObjectId) {
    console.log("Invalid ObjectId");
    return res.status(400).send("Invalid ObjectId");
  }

  try {
    const db = client.db("docter");
    const collection = db.collection("availableSlots");

    const savedSlots = await collection.findOne({
      dId: new ObjectId(id),
      sDate: date,
    });

    console.log("saved", savedSlots);
    if (savedSlots !== null) {
      res.send({ savedSlots: savedSlots.selectedSlots, timeSlots });
    } else {
      res.send({ savedSlots: [], timeSlots });
    }
  } catch (err) {
    res.status(500).send({ message: `Internal server error ${err}` });
  }

  //res.send(timeSlots);
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

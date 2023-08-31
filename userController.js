const express = require("express");
const jwt = require("jsonwebtoken");
const { secretKey } = require("./Auth/config");
const cors = require("cors");
const auth = require("./Auth/auth");
const doctersList = require("./doctorsList.json");
const { MongoClient } = require("mongodb");

const app = express();
app.use(express.json());

const url =
  "mongodb+srv://bandgarvarsha123:Wz3euzppPOVuqt19@cluster0.mynuvqs.mongodb.net/";
const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connectDb = async () => {
  try {
    await client.connect();
    console.log("Connected");
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

// const users = [
//   {
//     emailId: "bandgarvarsha@gmail.com",
//     password: "abc123",
//     role: "user",
//   },
//   {
//     emailId: "vijay@gmail.com",
//     password: "abc123",
//     role: "admin",
//   },
//   {
//     emailId: "bandgaronkar16@gmail.com",
//     password: "abc123",
//     role: "user",
//   },
// ];

app.post("/login", async (req, res) => {
  const { emailId, password } = req.body;

  const db = client.db("docter");
  const collection = db.collection("registration");
  // console.log("connected", collection);
  await collection
    .findOne({ emailId: emailId })
    .then((response) => {
      if (response) {
        const authToken = jwt.sign(
          {
            emailId: response.emailId,
            role: response.role,
            exp: Math.floor(Date.now() / 1000) + 10 * 60,
          },
          secretKey
        );
        console.log(response);
        let user = {
          jwt: authToken,
          fullname: response.fullName,
          id: response._id,
        };
        res.send(user);
      }
    })
    .catch((error) => {
      res.send(error);
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
  const { fullName, address, mobileNo, emailId, password } = req.body;
  console.log(await isExists(emailId));
  if (!fullName || !address || !mobileNo || !emailId || !password) {
    res.status(400).send({ message: "All fields are required" });
  } else if (!isValidEmail(emailId)) {
    res.status(409).send({ message: "Email Not Valid" });
  } else if (await isExists(emailId)) {
    res.status(409).send({ message: "Email already exists" });
  } else if (!mobileNo) {
    res.status(409).send({ message: "Mobile number is not valid" });
  } else {
    // registeredUsers.push({
    //   fullName,
    //   address,
    //   mobileNo,
    //   emailId,
    //   password,
    // });

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

app.get("/doctorList", (req, res) => {
  // console.log(doctersList);
  res.send(doctersList);
});

app.get("/searchDocter", (req, res) => {
  res.send(doctersList);
});

app.get("/docterProfile/:id", (req, res) => {
  // console.log(req.params.id);
  // res.send(req);
  // console.log(req);
  // console.log(req.query.name);
  const id = req.params.id;

  const filteredDocter = doctersList.find((docter) => docter.id == id);
  console.log("FD:", filteredDocter);
  res.send(filteredDocter);
});

app.get("/", (req, res) => {
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
  createDocument("mydb", "mycollection", { name: "John", age: 30 });
});

app.get("/mongo", async (req, res) => {
  const collectionName = client.db("mydb").collection("mycollection");
  // const collection = db.collection("mycollection");

  const col = await collectionName.find().toArray();
  console.log("col", col);
  res.send(col);
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

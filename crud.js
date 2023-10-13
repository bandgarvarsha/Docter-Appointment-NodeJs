const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
app.use(express.json());

const PORT = 5000;

const url =
  "mongodb+srv://bandgarvarsha123:Wz3euzppPOVuqt19@cluster0.mynuvqs.mongodb.net/";

const client = new MongoClient(url, {
  useNewUrlParser: true,
});

const connectDb = async () => {
  try {
    await client.connect();
    console.log("Connected to databse");
  } catch (err) {
    console.log(err);
  }
};

connectDb();

app.post("/operation", async (req, res) => {
  const { fullName, address } = req.body;
  async function createDocument(databaseName, collectionName, document) {
    const db = client.db(databaseName);
    const collection = db.collection(collectionName);

    try {
      const value = await collection.insertOne(document);
      console.log("inserted", value.insertedId);
    } catch (err) {
      console.log("err", err);
    }
  }

  createDocument("users", "info", {
    fullName,
    address,
  });

  return res.status(200).send("Inserted successfully");
});

// delte user
app.get("/removeUser/:name/:address", (req, res) => {
  const name = req.params.name;
  const address = req.params.address;

  console.log(name);
  const db = client.db("users");
  const collection = db.collection("info");

  let conditions = {};
  if (name == " ") {
    conditions.address = address;
  } else {
    conditions.name = name;
    conditions.address = address;
  }
  collection
    .deleteMany(conditions)
    .then((delRes) => {
      console.log("delRes", delRes);
      res.send(delRes);
    })
    .catch((err) => {
      console.log("Err", err);
    });
});

app.listen(PORT, () => {
  console.log("Server is running on port 5000");
});

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




const { MongoClient, ObjectId } = require("mongodb");

const url =
  "mongodb+srv://bandgarvarsha123:Wz3euzppPOVuqt19@cluster0.mynuvqs.mongodb.net/";
const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connectDb = async () => {
  try {
    await client.connect();
    console.log("Connected to the database");
  } catch (err) {
    console.log(err);
  }
};

module.exports = { client, connectDb };

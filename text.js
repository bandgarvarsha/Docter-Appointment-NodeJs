// Requiring module
const mongoose = require("mongoose");

// Connecting to database
mongoose.connect(
  "mongodb+srv://bandgarvarsha123:Wz3euzppPOVuqt19@cluster0.mynuvqs.mongodb.net/test",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Creating Schemas
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
});

// Creating models from userSchema and postSchema
const User = mongoose.model("User", userSchema);

// Query to find and show all the posts

User.find()
  .then((p) => console.log("then", p))
  .catch((error) => console.log(error));

mongoose.set("debug", (collectionName, method, query, doc) => {
  console.log(`${collectionName}.${method}`, JSON.stringify(query), doc);
});

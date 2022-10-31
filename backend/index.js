let express = require("express");
let app = express();
let mongoose = require("mongoose");
let cors = require("cors")

const router = require("./routes/route");

//to add middleware to read json and url data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

//connecting mongoose


mongoose
  .connect(
    "mongodb+srv://functionUp:UMZjiD9cN8Lb7RYo@cluster0.wew6u.mongodb.net/raftlabs",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => {
    console.log("mongo db connected");
  });

//mounting router
app.use("/", router);



app.listen(3000, () => {
  console.log("listening on port 3000");
});

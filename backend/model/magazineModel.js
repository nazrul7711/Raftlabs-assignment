let mongoose = require("mongoose");
let objectId = mongoose.Schema.Types.ObjectId;

let magazineModel = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  isbn: {
    type: String,
    required: true,
    unique: true,
  },
  author: [{
    type: objectId,
    required: true,
  }],
  publishedAt: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Magazine", magazineModel);

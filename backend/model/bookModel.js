let mongoose = require("mongoose");
let objectId = mongoose.Schema.Types.ObjectId;

let bookModel = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  isbn: {
    type: String,
    required: true,
    unique:true
  },
  author: [{type:objectId,ref:"Author"}],
  description:{
    type:String,
    required:true
  }


});

module.exports = mongoose.model("Book", bookModel);

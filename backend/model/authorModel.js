let mongoose = require("mongoose");
let objectId = mongoose.Schema.Types.ObjectId;

let authorModel = new mongoose.Schema({
  email: {
    type: String,
    required:true,
    unique:true
  },
  firstname: {
    type: String,
    required:true
  },
  lastname: {
    type: String,
    required:true
  },
  books:[{type:objectId,ref:"Book"}],
  magazines:[{type:objectId,ref:"Magazine"}]
});

module.exports = mongoose.model("Author", authorModel);

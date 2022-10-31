const authorModel = require("../model/authorModel");
const fs = require("fs");
const { parse } = require("csv-parse");
const bookModel = require("../model/bookModel");
const magazineModel = require("../model/magazineModel");

const readAuthor = async function (req, res) {
  try {
    let result = [];

    //creating a stream to read data in chunks
    fs.createReadStream("./csv/author.csv")
      .pipe(parse({ delimiter: ";", from_line: 2 }))
      .on("data", (data) => result.push(data))
      .on("end", async () => {
        for (let res of result) {
          const newAuthor = new authorModel({
            email: res[0],
            firstname: res[1],
            lastname: res[2],
          });
          //and storing the read data into our database

          const savedAuthor = await newAuthor.save();
          console.log(`email:${res[0]},firstname:${res[1]},lastname:${res[2]}`);
        }
        res.send("OK");
      });
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: err.msg });
  }
};

const addAuthors = async function (req, res) {
  try {
    //to add author in case we have a new one
    let body = req.body;

    let ifEmailExist = await authorModel.find({ email: body.email });
    if (ifEmailExist.length > 0) {
      return res.status(400).send("this email already exist");
    }

    //to make sure the user is not adding a book to a new author
    if (body.books) {
      return res.status(400).send("he is a new author cant have a book");
    }
    //above logic for the magazine
    if (body.magazines) {
      return res.status(400).send("he is a new author cant have a magazine");
    }
    //if above is ok then create a author
    let author = await authorModel.create(body);
    if (author) {
      return res.status(200).json(author);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send("sth went wrong");
  }
};

const allDetails = async function (req, res) {
  try {
    //to fetch book and magazine sorted data from the database
    let allBooks = await bookModel.find().sort({ title: 1 });
    let allmagazines = await magazineModel.find().sort({ title: 1 });
    //once data is fetched we put it inside an array so to show it to the user in one go
    let allDetails = [...allBooks, ...allmagazines];

    return res.status(200).json(allDetails);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

module.exports.readAuthor = readAuthor;
module.exports.allDetails = allDetails;
module.exports.addAuthors = addAuthors;

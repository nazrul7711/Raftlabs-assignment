const bookModel = require("../model/bookModel");
const authorModel = require("../model/authorModel");
const { parse } = require("json2csv");
const fs = require("fs");

const readBook = async function (req, res) {
  try {
    //read the book data and store it in database
    let result = [];
    fs.createReadStream("./csv/book.csv")
    //we use ";" delimiter
      .pipe(parse({ delimiter: ";", from_line: 2 }))
      .on("data", (data) => result.push(data))
      .on("end", async () => {
        for (let res of result) {
          //this if statement will split the authors in case we have more than one
          if (res[2].includes(",")) {
            let authors = res[2].split(",");

            let authorsList = [];
            for (let auth of authors) {
              const authorId = await authorModel.find(
                { email: auth },
                { _id: 1 }
              );
              authorsList.push(authorId[0]._id.toString());
            }
            const newBook = new bookModel({
              title: res[0],
              isbn: res[1],
              author: authorsList,
              description: res[3],
            });
            const savedBook = await newBook.save();
            console.log(
              `title:${res[0]},isbn:${res[1]},authors:${authorsList},description: ${res[3]}`
            );
          } else {
            //if we have only one author than this code kicks in
            const authorId = await authorModel.find(
              { email: res[2] },
              { _id: 1 }
            );

            const newBook = new bookModel({
              title: res[0],
              isbn: res[1],
              author: authorId,
              description: res[3],
            });
            const savedBook = await newBook.save();
          }
        }
        console.log(
          `title:${res[0]},isbn:${res[1]},authors:${authorsList},description: ${res[3]}`
        );
        res.status(200).send("OK data read");
      });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const bookByIsbn = async function (req, res) {
  try {
    let isbn = req.body.isbn;
    let book = await bookModel.find({ isbn: isbn });
    //if we have the book with this isbn otherwise we give an error to the user
    if (book) {
      return res.status(200).json(book);
    } else {
      return res
        .status(404)
        .json({ msg: "the book with this isbn is not in records" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const bookByEmail = async function (req, res) {
  try {
    //if we have the book by this email then show the user otherwise not
    let email = req.body.email;
    let book = await bookModel.find({ email: email });
    if (book) {
      return res.status(200).json({ data: book });
    } else {
      return res.status(404).json({ msg: "book by this email is not found" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

const addBook = async function (req, res) {
  try {
    
    let body = req.body;
    //if statement to see if we have more than one author
    if (body.authors.includes(",")) {
      email = body.authors.split(",");
      let authorsList = [];
      for (let auth of authors) {
        const authorId = await authorModel.find({ email: auth }, { _id: 1 });
        authorsList.push(authorId[0]._id.toString());
        //in case we do not have this author then we tell the user to create a new one
        if (authorId.length===0) {
          return res
            .status(404)
            .send(
              "this author is not in our record kindly create one then try adding this record"
            );
        }
      }
      const isIsbn = await bookModel.find({ isbn: body.isbn });
      //to check the isbn is unique
      if (isIsbn) {
        return res
          .status(404)
          .send("this isbn already exist enter something different");
      }
      //to make sure the book is unique
      const existingBook = await bookModel.find(
        { title: body.title },
        { _id: 1 }
      );
      if (existingBook.length > 0) {
        return res.status(404).send("this book title alredy exist");
      }

      let newBook = new bookModel({
        title: body.title,
        isbn: body.isbn,
        author: authorId,
        description: body.description,
      });
      //if above logic is ok then we creata a new book document
      let savedBook = await newBook.save();
      //this code is to write the book record into the csv
      let bookDetail = [
        "\n",
        body.title,
        body.isbn,
        body.authorsList,
        body.description,
      ].join(";");
      fs.appendFileSync("./csv/book.csv", bookDetail);

      //if both of the above code succeds we send a successfull msg to the user
      if (savedBook) {
        return res.status(200).send("book added successfully");
      }
    } else {
      // we repeat the same above code below in case we have only one author
      const authorId = await authorModel.find(
        { email: body.authors },
        { _id: 1 }
      );
      if (authorId.length === 0) {
        return res
          .status(404)
          .send(
            "this author is not in our record kindly create one then try adding this record"
          );
      }
      //to make sure book is unique
      const existingBook = await bookModel.find(
        { title: body.title },
        { _id: 1 }
      );
      if (existingBook.length > 0) {
        return res.status(404).send("this book title alredy exist");
      }

      //isbn is unique or not
      const isIsbn = await bookModel.find({ isbn: body.isbn });
      console.log(isIsbn.length);

      if (isIsbn.length !== 0) {
        return res
          .status(404)
          .send("this isbn already exist enter something different");
      }

      const newBook = new bookModel({
        title: body.title,
        isbn: body.isbn,
        author: authorId,
        description: body.description,
      });
      const savedBook = await newBook.save();

      let bookDetail = [
        "\n",
        body.title,
        body.isbn,
        body.authors,
        body.description,
      ].join(";");
      fs.appendFileSync("./csv/book.csv", bookDetail);
      console.log(savedBook);
      if (savedBook) {
        return res.status(200).send("book added successfully");
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

module.exports.readBook = readBook;
module.exports.bookByIsbn = bookByIsbn;
module.exports.bookByEmail = bookByEmail;
module.exports.addBook = addBook;


const authorModel = require("../model/authorModel");
const magazineModel = require("../model/magazineModel");

const fs = require("fs");


const readMagazine = async function (req, res) {
  try {
    // to read csv data and store the data into database and simultaneously giving a logical output in the console
    let result = [];
    fs.createReadStream("./csv/magazine.csv")
      .pipe(parse({ delimiter: ";", from_line: 2 }))
      .on("data", (data) => result.push(data))
      .on("end", async () => {
        for (let res of result) {
          //to check for the multiple authors
          if (res[2].includes(",")) {
            let authors = res[2].split(",");
            let dateStr = res[3];
            //to get proper date input
            let [date, month, year] = dateStr.split(".");
            let newDateStr = [year, month, date].join("-");
            const newDate = new Date(newDateStr);

            let authorsList = [];
            for (let auth of authors) {
              const authorId = await authorModel.find(
                { email: auth },

                { _id: 1 }
              );
              authorsList.push(authorId[0]._id.toString());
            }
            const newMagazine = new magazineModel({
              title: res[0],
              isbn: res[1],
              author: authorsList,
              publishedAt: newDate,
            });
            const savedMagazine = await newMagazine.save();
            console.log(
              `title :${res[0]},isbn :${res[1]},authors :${authorsList},publishedAt : ${res[3]}`
            );
          } else {
            //same above logic for a single author
            const authorId = await authorModel.find(
              { email: res[2] },
              { _id: 1 }
            );
            let dateStr = res[3];
            let [date, month, year] = dateStr.split(".");
            let newDateStr = [year, month, date].join("-");
            const newDate = new Date(newDateStr);

            const newMagazine = new magazineModel({
              title: res[0],
              isbn: res[1],
              author: authorId,
              publishedAt: newDate,
            });
            const savedMagazine = await newMagazine.save();
            console.log(
              `title :${res[0]},isbn :${res[1]},authors :${authorsList},publishedAt : ${res[3]}`
            );
          }
        }
        res.send("OK data read successfully");
      });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const magazineByIsbn = async function (req, res) {
  try {
    //see if the magazine by this isbn exist if so populate otherwise throw an error
    let isbn = req.body.isbn;
    console.log(req.body);
    let magazine = await magazineModel.find({ isbn: isbn });
    if (magazine) {
      return res.status(200).json(magazine);
    } else {
      return res
        .status(404)
        .json({ msg: "the magazine with this isbn is not in records" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const magazineByEmail = async function (req, res) {
  try {
    //see if the magazine by this email exist if so populate otherwise throw an error
    let email = req.body.email;
    let magazine = await magazineModel.find({ email: email });
    if (magazine) {
      return res.status(200).json({ data: magazine });
    } else {
      return res
        .status(404)
        .json({ msg: "magazine by this email is not found" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

const addMagazine = async function (req, res) {
  try {
    
    let body = req.body;
    //for adding magazines with multiple authors
    if (body.authors.includes(",")) {
      let authors = body.authors.split(",");
      let dateStr = body.publishedAt;
      //to convert the date into js Date format
      let [date, month, year] = dateStr.split(".");
      let newDateStr = [year, month, date].join("-");
      const newDate = new Date(newDateStr);

      //for check if we have unique magazine title
      let ifMagazineExist = await magazineModel.find({ title: body.title });

      if (ifMagazineExist.length > 0) {
        return res
          .status(400)
          .send("this title already exist so give a new name");
      }

      let authorsList = [];
      for (let auth of authors) {
        const authorId = await authorModel.find(
          { email: auth },

          { _id: 1 }
        );
        //if we dont have this author then throw an error
        if (authorId.length === 0) {
          return res
            .status(404)
            .send(
              "this author is not in our record kindly create one then try adding this record"
            );
        }
        authorsList.push(authorId[0]._id.toString());
      }
      //to see that the isbn is unique
      const isIsbn = await magazineModel.find({ isbn: body.isbn });

      if (isIsbn) {
        return res
          .status(404)
          .send("this isbn already exist enter something different");
      }
      const newMagazine = new magazineModel({
        title: body.title,
        isbn: body.isbn,
        author: authorsList,
        publishedAt: newDate,
      });
      const savedMagazine = await newMagazine.save();
      //to write the magazine detail into the csv
      let magazineDetail = [
        "\n",
        body.title,
        body.isbn,
        authorsList,
        newDate,
      ].join(";");
      fs.appendFileSync("./csv/magazine.csv", magazineDetail);
      return res.status(200).send("magazine added successfully");
    } else {
      //above logic for single author
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
      let dateStr = body.publishedAt;
      let [date, month, year] = dateStr.split(".");
      let newDateStr = [year, month, date].join("-");
      const newDate = new Date(newDateStr);


      let ifMagazineExist = await magazineModel.find({title:body.title})
      
      if(ifMagazineExist.length>0){
        return res.status(401).send("this title already exist so give a new name")
      }


      const isIsbn = await magazineModel.find({ isbn: body.isbn });

      if (isIsbn.length!==0) {
        return res
          .status(404)
          .send("this isbn already exist enter something different");
      }

      const newMagazine = new magazineModel({
        title: body.title,
        isbn: body.isbn,
        author: authorId,
        publishedAt: newDate,
      });
      const savedMagazine = await newMagazine.save();
      let magazineDetail = [
        "\n",
        body.title,
        body.isbn,
        authorId,
        newDate,
      ].join(";");
      fs.appendFileSync("./csv/magazine.csv", magazineDetail);
      return res.status(200).send("magazine added successfully");
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

module.exports.readMagazine = readMagazine;
module.exports.magazineByIsbn = magazineByIsbn;
module.exports.magazineByEmail = magazineByEmail;
module.exports.addMagazine = addMagazine;


//The code for the assignment is located in the master section .

// I have completed the assignment . the code for the solution of assignment two is located in algo.js and the visual representation of the chessboard is located in algo.html

// apart from the assignment two I have made the UI of three APIs with react and the code for those is located in the frontend section. Following are the APIs for which I have made UI . 1 Add a book 2 Add a magazine 3 Get all the books and magazines sorted by title.

// I have made a seperate csv folder to store the csv data and our APIs read data from this csv file and the api which you asked to write data into csv also appends this csv file
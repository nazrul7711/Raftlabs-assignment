let express = require("express")
let router = express.Router()
let authorController = require("../controllers/authorController")
let bookController = require("../controllers/bookController")
let magazineControler =  require("../controllers/magazineController")


// author routes
router.get("/readAuthors",authorController.readAuthor)
router.get("/allDetails",authorController.allDetails)
router.post("/addAuthors",authorController.addAuthors)

//book routes
router.get("/readBooks",bookController.readBook)
router.get("/bookByIsbn",bookController.bookByIsbn)
router.get("/bookByEmail",bookController.bookByEmail)
router.post("/addBook",bookController.addBook)

//magazine routes 
router.get("/readMagazine",magazineControler.readMagazine)
router.get("/magazineByIsbn",magazineControler.magazineByIsbn)
router.get("/magazineByEmail",magazineControler.magazineByEmail)
router.post("/addMagazine",magazineControler.addMagazine)



module.exports = router

const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");

router.get("/view/:id", questionController.getQuestion);
router.post("/add", questionController.addQuestion);
router.post("/edit/:id", questionController.editQuestion);
router.get("/delete/:id", questionController.deleteQuestion);
module.exports = router;

const express = require("express");
const router = express.Router();
const answerController = require("../controllers/answerController");

router.post("/add/:questionId", answerController.addAnswer);
router.post("/edit/:id", answerController.editAnswer);
router.get("/delete/:id", answerController.deleteAnswer);
module.exports = router;

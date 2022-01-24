const db = require("../db");

exports.addQuestion = async (req, res, next) => {
  const { name, question } = req.body;
  let userId;
  console.log("Req Body:", name, question);
  //Checking already user exists
  const user = await isUserExists(name);
  console.log("isUserExists: ", user.length);
  //If user found add question in the name of existing user
  if (user.length != 0) {
    console.log("If block");
    userId = user[0].userId;
  } //Else create new user
  else {
    console.log("Else block");
    insertedDetails = await createUser(name);
    userId = insertedDetails.insertId;
  }
  //Add question to the user
  const result = await createQuestion(question, userId);
  console.log("UserId", userId);
  console.log("results", result);
  res.redirect("back");
};

exports.getQuestion = async (req, res, next) => {
  //Get question
  const questions = await selectQuestion(req.params.id);
  console.log("Questions", questions);
  //   if (questions.length === 0) return console.log("No such question found");
  //Get all answers
  const answers = await selectAnswers(req.params.id);
  console.log("Answers", answers);
  res.render("question.ejs", {
    questions,
    answers,
  });
  return console.log("***End***");
};

exports.editQuestion = async (req, res, next) => {
  await updateQuestion(req.body.question, req.params.id);
  res.redirect("back");
};

exports.deleteQuestion = async (req, res, next) => {
  await dropQuestion(req.params.id);
  res.redirect("back");
};

//Utility functions
function isUserExists(name) {
  return new Promise(function (resolve, reject) {
    db.query("SELECT * FROM users WHERE name = ?", [name], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}
function createUser(name) {
  return new Promise(function (resolve, reject) {
    const sql = "INSERT INTO users(name) VALUES (?)";
    db.query(sql, [name], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}
function createQuestion(question, userId) {
  return new Promise(function (resolve, reject) {
    const sql = "INSERT INTO questions(content,userId) VALUES (?,?)";
    db.query(sql, [question, userId], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

function updateQuestion(question, id) {
  return new Promise(function (resolve, reject) {
    const sql = "UPDATE questions SET content=? WHERE questionId=?";
    db.query(sql, [question, id], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

function selectQuestion(id) {
  return new Promise(function (resolve, reject) {
    const sql =
      "SELECT q.questionId,q.content,u.name FROM questions q INNER JOIN users u ON q.userId=u.userId WHERE q.questionId=?";
    db.query(sql, [id], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

function selectAnswers(id) {
  return new Promise(function (resolve, reject) {
    const sql =
      "SELECT a.answerId,a.content,u.name FROM answers a INNER JOIN users u ON a.userId=u.userId WHERE a.questionId = ?";
    db.query(sql, [id], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

function dropQuestion(id) {
  return new Promise(function (resolve, reject) {
    const sql = "DELETE FROM questions WHERE questionId=?";
    db.query(sql, [id], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

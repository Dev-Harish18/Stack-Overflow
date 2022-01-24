const db = require("../db");

exports.addAnswer = async (req, res, next) => {
  const { name, answer } = req.body;
  let userId;
  console.log("Req Body:", name, answer, req.params.questionId);
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
  const result = await createAnswer(answer, userId, req.params.questionId);
  console.log("UserId", userId);
  console.log("results", result);
  res.redirect("back");
};

exports.editAnswer = async (req, res, next) => {
  await updateAnswer(req.body.answer, req.params.id);
  res.redirect("back");
};

exports.deleteAnswer = async (req, res, next) => {
  await dropAnswer(req.params.id);
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
function createAnswer(answer, userId, questionId) {
  return new Promise(function (resolve, reject) {
    const sql = "INSERT INTO answers(content,userId,questionId) VALUES (?,?,?)";
    db.query(sql, [answer, userId, questionId], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

function updateAnswer(answer, id) {
  return new Promise(function (resolve, reject) {
    const sql = "UPDATE answers SET content=? WHERE answerId=?";
    db.query(sql, [answer, id], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

function dropAnswer(id) {
  return new Promise(function (resolve, reject) {
    const sql = "DELETE FROM answers WHERE answerId=?";
    db.query(sql, [id], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

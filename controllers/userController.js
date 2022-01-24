const db = require("../db");

exports.home = async (req, res, next) => {
  const questions = await selectQuestions();
  console.log("Questions", questions);

  const resultsPerPage = 2;
  const numOfResults = questions.length;
  const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
  let page = req.query.page ? Number(req.query.page) : 1;
  if (page > numberOfPages) {
    res.redirect("/?page=" + encodeURIComponent(numberOfPages));
  } else if (page < 1) {
    res.redirect("/?page=" + encodeURIComponent("1"));
  }
  //Determine the SQL LIMIT starting number
  const startingLimit = (page - 1) * resultsPerPage;
  //Get the relevant number of POSTS for this starting page
  const results = await selectPage(startingLimit, resultsPerPage);
  let iterator = page - 1 < 1 ? 1 : page - 1;
  let endingLink =
    iterator + 2 <= numberOfPages
      ? iterator + 2
      : page + (numberOfPages - page);

  res.render("home", {
    questions: results,
    page,
    iterator,
    endingLink,
    numberOfPages,
  });
};

function selectQuestions() {
  return new Promise(function (resolve, reject) {
    const sql =
      "SELECT q.questionId,q.content,u.name FROM questions q INNER JOIN users u ON q.userId=u.userId";
    db.query(sql, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

function selectPage(startingLimit, resultsPerPage) {
  return new Promise(function (resolve, reject) {
    const sql = `SELECT q.questionId,q.content,u.name FROM questions q INNER JOIN users u ON q.userId=u.userId LIMIT ${startingLimit},${resultsPerPage}`;
    db.query(sql, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

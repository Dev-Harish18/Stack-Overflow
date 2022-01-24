const express = require("express");
const dotenv = require("dotenv");

const db = require("./db");
const userRouter = require("./routes/userRoutes");
const questionRouter = require("./routes/questionRoutes");
const answerRouter = require("./routes/answerRoutes");

const app = express();
//For environment varialbles
dotenv.config();
//Connecting to db
db.connect(function (err) {
  if (err) throw err;
  console.log("DB Connected!");
});
//For parsing json and url from clients
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//Configuring static files
app.use(express.static("public"));
//Configuration for rendering engine ejs
app.set("view engine", "ejs");
app.set("views", "./views");
//Mounting routes
app.use("/question", questionRouter);
app.use("/answer", answerRouter);
app.use("/", userRouter);

//Listening
app.listen(process.env.PORT, () =>
  console.log(`App is up and running at port ${process.env.PORT}`)
);

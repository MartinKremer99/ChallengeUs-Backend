/*
  CHANGE THE LINE AT 35 THE FIRST TIME
*/

const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();

var routes = require("./routes");
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const cors = require("cors");
app.use(cors({ credentials: true, origin: process.env.FRONTEND_HOSTNAME }));
app.use(express.json());
routes(app);

const db = require("./models");
db.sequelize
  .query("SET FOREIGN_KEY_CHECKS = 0")
  .then(function () {
    //CHANGE to true if you want to initialize the database the first time
    //!!! You need to change it back to false after the first time to not reset the database everytime
    return db.sequelize.sync({ force: false });
  })
  .then(function () {
    return db.sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
  })
  .then(
    function () {
      console.log("Database synchronized.");
    },
    function (err) {
      console.log(err);
    }
  );

app.listen(process.env.EXPRESS_PORT, process.env.EXPRESS_HOST);

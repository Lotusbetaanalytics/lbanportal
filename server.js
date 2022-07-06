const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const morgan = require("morgan");
const colors = require("colors");
const dotenv = require("dotenv").config();
const cors = require("cors");
const path = require("path");
const rateLimit = require("express-rate-limit");
const express = require("express");
const connectDB = require("./config/db");

// import routes
const authRoute = require("./routes/auth");
const appraisalRoute = require("./routes/appraisal");
const initiativeRoute = require("./routes/initiative");
const appraisalARoute = require("./routes/appraisalA");
const resultRoute = require("./routes/result");
const scoreRoute = require("./routes/score");
const perspectiveRoute = require("./routes/perspective");
const calibrationRoute = require("./routes/calibration");
const optionRoute = require("./routes/option");
const sectionAResultRoute = require("./routes/sectionAResult");
const logsRoute = require("./routes/log");

// configure express
const app = express();

//connection to the db
connectDB();

// set up app
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

//Sanitize data
app.use(mongoSanitize());

//set security headers
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// Prevent XSS attacks
app.use(xss());

//Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 10000,
});
app.use(limiter);

app.use(cors());

//Set static folder
app.use(express.static(path.join(__dirname, "public")));

// configure routes
app.use("/api/v1/staff/auth", authRoute);
app.use("/api/v1/appraisal", appraisalRoute);
app.use("/api/v1/initiative", initiativeRoute);
app.use("/api/v1/section/a", appraisalARoute);
app.use("/api/v1/result", resultRoute);
app.use("/api/v1/score", scoreRoute);
app.use("/api/v1/perspective", perspectiveRoute);
app.use("/api/v1/calibration", calibrationRoute);
app.use("/api/v1/option", optionRoute);
app.use("/api/v1/check/section/a/result", sectionAResultRoute);
app.use("/api/v1/logs", logsRoute);
app.use("/api/v1/report", require("./routes/report"));
app.use("/api/v1/departments", require("./routes/department"));


app.use(function (req, res, next) {
  console.log("%s %s", req.method, req.url);
  next();
});

app.engine(".html", require("ejs").__express);
app.set("view engine", "html");
app.set("views", __dirname + "/public");
app.set("view engine", "html");

app.get("/*", function (req, res) {
  if (req.xhr) {
    var pathname = url.parse(req.url).pathname;
    res.sendfile("index.html", {root: __dirname + "/public" + pathname});
  } else {
    res.render("index");
  }
});

const PORT = process.env.PORT || 8000;

const server = app.listen(
  PORT,
  console.log(`Server running on port ${PORT}`.yellow)
);

//Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);

  server.close(() => process.exit(1));
});

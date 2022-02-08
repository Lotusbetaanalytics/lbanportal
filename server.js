const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const morgan = require("morgan");
const colors = require("colors");
const dotenv = require("dotenv").config();
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const express = require("express");
const connectDB = require("./config/db");

// import routes
const authRoute = require("./routes/auth.routes");
const appraisalRoute = require("./routes/appraisal.routes");
const initiativeRoute = require("./routes/initiative.routes");
const appraisalARoute = require("./routes/appraisalA.routes");
const resultRoute = require("./routes/result.routes");

// configure express
const app = express();

//connection to the db
connectDB();

// set up app
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  max: 100,
});
app.use(limiter);
app.use(cors());

// configure routes
app.use("/api/v1/staff/auth", authRoute);
app.use("/api/v1/appraisal", appraisalRoute);
app.use("/api/v1/initiative", initiativeRoute);
app.use("/api/v1/appraisala", appraisalARoute);
app.use("/api/v1/result", resultRoute);

app.get("/", (req, res) => {
  return res.status(200).json({ msg: "This is the api for the lban portal" });
});

const PORT = process.env.PORT || 3000;

const server = app.listen(
  PORT,
  console.log(`Server running on port ${PORT}`.yellow)
);

//Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);

  server.close(() => process.exit(1));
});

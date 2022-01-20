const mongoose = require("mongoose");

const connectDB = () => {
  const conn = mongoose
    .connect(process.env.MONGO_URI)
    .then((con) => {
      console.log(
        `MongoDB Connected on: ${con.connection.host} at port: ${con.connection.port} `
          .cyan.underline
      );
    })
    .catch((err) => {
      console.error(`Error: ${err.message}`.red.underline);
    });
};

module.exports = connectDB;

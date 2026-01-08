const mongoose = require("mongoose");

const ConnectDb = async (url) => {
  try {
    await mongoose.connect(url);
    console.log("Database is connected successfully");
  } catch (error) {
    console.log("error", error);
  }
};

module.exports = ConnectDb;

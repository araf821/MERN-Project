const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true });
  } catch (error) {
    console.log(error);
  }
};

// const connectDb = mongoose.createConnection(process.env.DATABASE_URI);

module.exports = connectDb;

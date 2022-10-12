const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_CNN);
    console.log("Db conectada");
  } catch (error) {
    console.log(error);
    throw new Error("Error al inizialiar la bd");
  }
};

module.exports = { dbConnection };

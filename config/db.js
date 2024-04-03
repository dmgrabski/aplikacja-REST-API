const mongoose = require('mongoose');
//kom
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://dmgrabski97:RrH4bEG86nt8iLwt@cluster0.k8imvuf.mongodb.net/', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connection successful");
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

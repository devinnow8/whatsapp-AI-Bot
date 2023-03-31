const mongoose = require("mongoose");
require("dotenv").config();

const options = {
  autoIndex: false, // Don't build indexes
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  //   family: 4, // Use IPv4, skip trying IPv6
  keepAlive: true,
  keepAliveInitialDelay: 300000,
};

const dbConnect = async () => {
  try {
    const res = await mongoose.connect(process.env.MONGODB_URI, options);
  } catch (error) {
    console.log({ message: error.message });
  }
};

module.exports = { dbConnect };

import mongoose from "mongoose";

// define a type it also look like interface
type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  // next js me backend hamesha run nhi krta bo user ke instruction pr hi run hota hai
  // jis karan data base me ek extra check lagana prta hai
  // ye sirf next js me hota hai

  if (connection.isConnected) {
    console.log("Already connected to database");
    return;
  }
  try {
    const Db = await mongoose.connect(process.env.MONGO_URI || "");

    connection.isConnected = Db.connections[0].readyState;
    console.log(Db);

    console.log("DB connection successfully");
  } catch (error) {
    console.log("Error while database connection", error);
    process.exit(1);
  }
}

export default dbConnect;

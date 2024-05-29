import mongoose from "mongoose";
export const dbConnection = async () => {
  try {
    // const conn = await mongoose.connect(process.env.MONGO_URL, {
    //   dbName: "DatingAppNovem",
    // });
    const conn = await mongoose.connect("mongodb://127.0.0.1/DatingApp");
    console.log(`Connected to mongoDB ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error in connecting mongoDB`);
    console.log(error.message);
  }
};

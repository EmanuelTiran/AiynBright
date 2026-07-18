import mongoose, { connect } from "mongoose";

let connectionPromise = null;

export const connectToMongo = async () => {
   if (mongoose.connection.readyState === 1) {
      return;
   }
   if (!connectionPromise) {
      const mongoUri = process.env.MONGO_URI || "mongodb+srv://test:1234@cluster0.onb7tvx.mongodb.net/AyinBright";
      connectionPromise = connect(mongoUri)
        .then(() => console.log('connected to mongo'))
        .catch((error) => {
           connectionPromise = null; // מאפשר ניסיון חוזר בכשל
           console.log('error connect to mongo', error);
        });
   }
   await connectionPromise;
}
import mongoose,{ connect } from "mongoose";

export const connectToMongo = async () => {
   try {
      if (mongoose.connection.readyState === 1) {
         console.log('already connected');
         return;
         
      }
      const mongoUri = process.env.MONGO_URI || "mongodb+srv://test:1234@cluster0.onb7tvx.mongodb.net/AyinBright";

      // Connect to MongoDB
      await connect(mongoUri);
   console.log('connected to mongo');
} catch (error) {
   console.log('error connect to mongo',error);
}
}
import mongoose,{ connect } from "mongoose";

export const connectToMongo = async () => {
   try {
      if (mongoose.connection.readyState === 1) {
         console.log('already connected');
         return;
         
      }
   await connect(process.env.MONGO_URI)
   console.log('connected to mongo');
} catch (error) {
   console.log('error connect to mongo',error);
}
}
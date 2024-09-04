import mongoose from 'mongoose';

const connectDb = async () => {
   try {
      await mongoose.connect(
         `mongodb://localhost:27017/${process.env.DB_NAME}`
      );
      console.log('CONNECTED SUCCESSFULLY');
   } catch (error) {
      console.log('DONOT CONNECTED SUCCESSFULLY', error);
      process.exit(1);
   }
};
export default connectDb;

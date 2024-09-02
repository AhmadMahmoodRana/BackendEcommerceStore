import express from 'express';
import 'dotenv/config';
import connectDb from './config/database.js';

const PORT = process.env.PORT || 4000;
const app = express();
connectDb()
   .then(() => {
      app.listen(PORT, () => {
         console.log(`Server is running on port ${PORT}`);
      });
   })
   .catch((error) => {
      console.error('Database connection error:', error);
   });

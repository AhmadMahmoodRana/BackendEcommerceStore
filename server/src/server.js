import express from 'express';
import 'dotenv/config';
import connectDb from './config/database.js';
import MainRoutes from './routes/routes.js';
import cors from 'cors'
const PORT = process.env.PORT || 4000;
const app = express();

app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true, // allow session cookies from client-side
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
   }));


MainRoutes(app);


   
connectDb()
   .then(() => {
      app.listen(PORT, () => {
         console.log(`Server is running on port ${PORT}`);
      });
   })
   .catch((error) => {
      console.error('Database connection error:', error);
   });

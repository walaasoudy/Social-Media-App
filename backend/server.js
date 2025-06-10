import express from 'express';
const app = express();
import cookieParser from "cookie-parser";
import dotenv from 'dotenv'
import connectiondb from './db/db.js'
import authRoutes from "./routes/auth.routes.js"
dotenv.config()
app.use(express.json())
app.use(cookieParser()); 
connectiondb()
const port = process.env.PORT || 8000
app.use("/api/auth", authRoutes);
console.log(process.env.MONGO_URL);
app.listen(port, () => {
  console.log(`server is running on ${port} `);
  
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
      message: err.message,
      stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
    });
  });
});
import express from 'express';
const app = express();
import { v2 as cloudinary } from "cloudinary";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv'
import connectiondb from './db/db.js'
import authRoutes from "./routes/auth.routes.js"
import postsRoutes from './routes/post.route.js'

dotenv.config()
app.use(express.json())
app.use(cookieParser()); 
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
connectiondb()
const port = process.env.PORT || 8000
app.use("/api/auth", authRoutes);
app.use("/api/posts", postsRoutes);
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
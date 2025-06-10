import express from 'express';
const app = express();
import { v2 as cloudinary } from "cloudinary";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv'
import connectiondb from './db/db.js'
import authRoutes from "./routes/auth.routes.js"
import postsRoutes from './routes/post.route.js'
import notificationRoutes from './routes/notification.route.js'
import userRoute from './routes/user.route.js'
dotenv.config()
app.use(express.json())
app.use(cookieParser()); 
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerOptions from './swagger.js'; 

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
connectiondb()
const port = process.env.PORT || 8000

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// You can now access your API docs at http://localhost:8000/api-docs

app.use("/api/auth", authRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/user",userRoute);


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
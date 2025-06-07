import express from 'express';
const app = express();
import dotenv from 'dotenv'
import connectiondb from './db/db.js'
import authRoutes from "./routes/auth.routes.js"
dotenv.config()
app.use(express.json())
connectiondb()
const port = process.env.PORT || 8000
app.use("/api/auth", authRoutes);
console.log(process.env.MONGO_URL);
app.listen(port, () => {
  console.log(`server is running on ${port} `);
});
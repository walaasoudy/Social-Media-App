import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
export const protectedRoute = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401);
    throw new Error("Unauthorized: No Token Provided");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (!decoded) {
    res.status(401);
    throw new Error("Unauthorized: Invalid Token");
  }

  const user = await User.findById(decoded.userId).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  req.user = user;
  next();
});
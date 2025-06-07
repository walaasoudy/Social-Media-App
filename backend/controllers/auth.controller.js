import asyncHandler from "express-async-handler";
import User from "../models/user.model.js"; // adjust path if needed
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
export const signup = asyncHandler(async (req, res) => {
  const { username, fullname, email, password } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400);
    throw new Error("Invalid email format");
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    res.status(400);
    throw new Error("Username already exists");
  }

  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    res.status(400);
    throw new Error("Email already exists");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  

  // Add your logic to hash the password and save the user
  const user = await User.create({
    username,
    fullname,
    email,
    password: hashedPassword, // Store the hashed password
  });
  if(user){
    generateTokenAndSetCookie(user._id, res);
    await user.save();
  }
  res.status(201).json({ message: "User registered successfully", user });
});

export const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
});

export const logout = asyncHandler(async (req, res) => {
  res.json({ data: "you hit the logout endpoint" });
});

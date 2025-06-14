import asyncHandler from "express-async-handler";
import User from "../models/user.model.js"; 
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
  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters");
  }
  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  

  const user = await User.create({
    username,
    fullname,
    email,
    password: hashedPassword, 
  });
  if(user){
    generateTokenAndSetCookie(user._id, res);
    await user.save();
  }
  res.status(201).json({ message: "User registered successfully", user });
});

export const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({username});
  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }

  const isPasswordCorrect = await bcrypt.compare(password,user.password)
  if (!isPasswordCorrect) {
    res.status(400);
    throw new Error("Invalid password");
  }
  generateTokenAndSetCookie(user._id, res);
    res.status(200).json({
    message: "Login successful",
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
    },
  });

});

export const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0), 
  });

  res.status(200).json({ message: "Logged out successfully" });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json(user);
});



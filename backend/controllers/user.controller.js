import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

export const getUserProfile = asyncHandler(async (req, res) => {
    const username = req.params.username;
    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    return res.status(200).json({
      message: "User fetched successfully",
      user,
    });
    });

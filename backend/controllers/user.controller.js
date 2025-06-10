import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import asyncHandler from "express-async-handler"; 

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

export const followUnfollowUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userToModify = await User.findById(id);
  const currentUser = await User.findById(req.user._id);
  if (id === req.user._id.toString()) {
    res.status(400);
    throw new Error("You can't follow/unfollow yourself");
  }
  if (!userToModify || !currentUser) {
    res.status(404);
    throw new Error("You can't follow/unfollow yourself");
  }
  const isFollowing = currentUser.following.includes(id);

  if (isFollowing) {
    // Unfollow the user
    await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
    await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });

    res.status(200).json({ message: "User unfollowed successfully" });
  } else {
    await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
    await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });

    const newNotification = new Notification({
      type: "follow",
      from: req.user._id,
      to: userToModify._id,
    });

    await newNotification.save();
    res.status(200).json({ message: "User followed successfully" });
  }
});

export const getSuggestedUsers = asyncHandler(async (req, res) => {
const userId = req.user._id;
const usersFollowedByMe = await User.findById(userId).select("following");
const users = await User.aggregate([
  {
    $match: {
      _id: { $ne: userId },
    },
  },
  { $sample: { size: 10 } },
]);


const filteredUsers = users.filter(
  (user) => !usersFollowedByMe.following.includes(user._id)
);
const suggestedUsers = filteredUsers.slice(0, 4);

suggestedUsers.forEach((user) => (user.password = null));
return res.status(200).json({
  message: "Suggested Users fetched successfully",
  count: suggestedUsers.length,
  suggestedUsers,
});
});


export const updateUser = asyncHandler(async (req, res) => {
  const { fullname, email, username, currentPassword, newPassword, bio, link } =
    req.body;
  let { profileImg, coverImg } = req.body;

  const userId = req.user._id;

  let user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  if ((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
    res.status(400);
    throw new Error("Please provide both current password and new password");
  }

  if (currentPassword && newPassword) {
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      res.status(400);
      throw new Error("Current password is incorrect");
    }
    if (newPassword.length < 6) {
      res.status(400);
      throw new Error("Password must be at least 6 characters long");
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
  }

  if (profileImg) {
    if (user.profileImg) {
      const imgId = user.profileImg.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    const uploadedResponse = await cloudinary.uploader.upload(profileImg);
    profileImg = uploadedResponse.secure_url;
  }

  if (coverImg) {
    if (user.coverImg) {
      const imgId = user.coverImg.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    const uploadedResponse = await cloudinary.uploader.upload(coverImg);
    coverImg = uploadedResponse.secure_url;
  }

  user.fullname = fullname || user.fullname; // Change fullName to fullname
  user.email = email || user.email;
  user.username = username || user.username;
  user.bio = bio || user.bio;
  user.link = link || user.link;
  user.profileImg = profileImg || user.profileImg;
  user.coverImg = coverImg || user.coverImg;

  user = await user.save();

  user.password = null;

  return res.status(200).json({ message: "upadated successfully", user });
});

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

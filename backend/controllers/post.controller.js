import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";
import asyncHandler from "express-async-handler";

export const createPost = asyncHandler(async (req, res) => {
  const { text } = req.body;
  let { img } = req.body;
  const userId = req.user._id.toString();

  const user = await User.findById(userId);
  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }

  if (!text && !img) {
    res.status(400);
    throw new Error("Post must have text or image");
  }

  if (img) {
    const uploadImg = await cloudinary.uploader.upload(img);
    img = uploadImg.secure_url;
  }

  const post = await Post.create({
    user: userId,
    text,
    img,
  });

  return res.status(201).json({ message: "Post created successfully", post });
});
 
export const deletePost = asyncHandler(async (req, res) => {
  const post = Post.findById(req.params);
  if (!post) {
    res.status(400);
    throw new Error("Post not found");
  }
  if (post.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("You are not authorized to delete this post");
  }
  if (post.img) {
    const imgId = post.img.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(imgId);
  }

  await Post.findByIdAndDelete(req.params.id);

  return res.status(200).json({ message: "Post deleted successfully" });
});
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

export const commentOnPost = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const postId = req.params.id;
  const userId = req.user._id;

  if (!text) {
    res.status(400);
    throw new Error("Text field is required");
  }

  const post = await Post.findById(postId);
  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  const comment = { user: userId, text };
  post.comments.push(comment);
  await post.save();

  await post.populate("comments.user", "-password");

  return res.status(200).json(post);
});

export const likeUnlikePost = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const postId = req.params.id;

  const post = await Post.findById(postId);
  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  const userLiked = post.likes.includes(userId);

  if (userLiked) {

    await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
    await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

    const updatedLikes = post.likes.filter(
      (id) => id.toString() !== userId.toString()
    );

    return res.status(200).json({
      message: "Post unliked successfully",
      likes: updatedLikes,
    });
  } else {

    post.likes.push(userId);
    await User.updateOne(
      { _id: userId },
      { $addToSet: { likedPosts: postId } }
    );
    await post.save();

    if (userId.toString() !== post.user.toString()) {
      const notification = new Notification({
        from: userId,
        to: post.user,
        type: "like",
      });
      await notification.save();
    }

    return res.status(200).json({
      message: "Post liked successfully",
      likes: post.likes,
    });
  }
});

export const getAllPosts = asyncHandler(async (req, res) => {
const posts = await Post.find()
  .sort({ createdAt: -1 })
  .populate({
    path: "user",
    select: "-password",
  })
  .populate({
    path: "comments.user",
    select: "-password",
  });
  if (posts.length === 0) {
    res.status(200);
    throw new Error("No posts found");
  }
  return res.status(200).json({ message: "data: ", posts });
})
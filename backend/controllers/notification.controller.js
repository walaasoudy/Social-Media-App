import Notification from "../models/notification.model.js"; 
import asyncHandler from "express-async-handler"; 

export const getNotifications = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    res.status(401); 
    throw new Error("User not authenticated or ID not found.");
  }

  const notifications = await Notification.find({ to: userId })
    .populate({
      path: "from",
      select: "username profileImg", 
    })
    .sort({ createdAt: -1 }); 
  await Notification.updateMany({ to: userId }, { read: true });

  if (notifications.length === 0) {
    return res.status(200).json({
      message: "No new notifications found.",
      count: 0,
      notifications: [],
    });
  }

  return res.status(200).json({
    message: "Notifications fetched successfully",
    count: notifications.length,
    notifications,
  });
});


export const deleteNotifications = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    if (!userId) {
      res.status(401);
      throw new Error("User not authenticated or ID not found.");
    }
    await Notification.deleteMany({ to: userId });
    return res.status(200).json({
      message: "Notifications deleted successfully"
    });
})
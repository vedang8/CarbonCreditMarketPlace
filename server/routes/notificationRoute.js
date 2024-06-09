const express = require("express");
const router = new express.Router();
const Notification = require("../models/notification");
const authenticate = require("../middleware/authenticate");

module.exports = (io) => {
  // add a notification
  router.post("/notify", authenticate, async (req, res) => {
    try {
      const newNotification = new Notification(req.body);
      await newNotification.save();
      res.send({
        success: true,
        message: "Notification added successfully",
      });
    } catch (error) {
      res.send({
        success: false,
        message: error.message,
      });
    }
  });

  // get all notifications by user
  router.get("/get-all-notifications", authenticate, async (req, res) => {
    const user = req.rootUser;
    const userId = user._id;
    try {
      const notifications = await Notification.find({
        user: userId,
      }).sort({ createdAt: -1 });
      res.send({
        success: true,
        data: notifications,
      });
    } catch (error) {
      res.send({
        success: false,
        message: error.message,
      });
    }
  });

  // delete a notification
  router.delete("/delete-notification/:id", authenticate, async (req, res) => {
    try {
      await Notification.findByIdAndDelete(req.params.id);
      res.send({
        success: true,
        message: "Notification deleted successfully",
      });
    } catch (error) {
      res.send({
        success: false,
        message: error.message,
      });
    }
  });

  // read all notifications by user
  router.put("/read-all-notifications", authenticate, async (req, res) => {
    const user = req.rootUser;
    const userId = user._id;
    try {
      await Notification.updateMany(
        { user: userId, read: false },
        { $set: { read: true } }
      );
      res.send({
        success: true,
        message: "All notifications marked as read",
      });
    } catch (error) {
      res.send({
        success: false,
        message: error.message,
      });
    }
  });

  return router;
  
};

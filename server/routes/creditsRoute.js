const router = require("express").Router();
const CreditForm = require("../models/creditForm");
const authenticate = require("../middleware/authenticate");
const genform = require("../models/creditForm");
const cloudinary = require("../db/cloudinaryConn");
const { ObjectId } = require("mongoose").Types;
const multer = require("multer");
const fs = require("fs");
const mongoose = require("mongoose");
const { uploadImageCloudinary } = require("../db/uploadClodinary");
const userdb = require("../models/user");
const creditdb = require("../models/credits");
const { serialize } = require("v8");
const morgan = require("morgan");

router.use(morgan("combined"));
// update user credits
router.put("/update-user-credits/:userId", authenticate, async (req,res) => {
    try{
      const { userId } = req.params;
      const { credits } = req.body;

      // finding user by id
      const user = await userdb.findById(userId);
      user.credits += credits;
      await user.save();

      res.send({
        success: true,
        message: "User's credits are updated",
      });
    }catch(error){
      res.send({
        success: false,
        message: error.message,
      });
    }
});

// create a credits record
router.post("/assign-credits/:userId", authenticate, async(req, res) => {
  try{
    const { userId } = req.params;
    const { projectName, credits, ed } = req.body;
    
    // creating a new credits document
    const newCredit = new creditdb({
      user: userId,
      projectName: projectName,
      amount: credits,
      expiryDate: ed,
      status: "active"
    });

    await newCredit.save();
    res.send({
      success: true,
      message: "Credits are assigned to user successfully",
    });
  }catch(error){
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// getting all the credits earned 
router.get("/get-credits/user", authenticate, async(req, res) => {
    try{
      const user = req.rootUser;
      const userId = user._id; // Access user ID directly from req.user
      const credits = await creditdb.find({user: userId});
      if(credits){
        res.send({
          success: true,
          message: "Your credits are here!!!",
          credits,
        });
      }
      else{
        res.send({
          success: false,
          message: "You have not earned any credits",
          credits,
        });
      }
    }catch(error){
      res.send({
        success: false,
        message: error.message,
      });
    }
});

// update user credits status
router.put("/update-credits-status", authenticate, async(req, res) => {
   const { credit_id } = req.body;
   const status = "expired";
   try{
     const credits = await creditdb.findByIdAndUpdate(credit_id, { status });
     res.send({
      success: true,
      message: "User credits updated Successfully",
    });
   }catch(error){
    res.send({
      success: false,
      message: error.message,
    })
   }
});

// get reward credits
router.get("/get-reward-credits-user", authenticate, async(req, res) => {
    const user = req.rootUser;
    const reward_credits = user.rewardCredits;
    try{
      res.send({
        success: true,
        reward_credits,
      });
    }catch(error){
      res.send({
        success: false,
        message: error.message,
      });
    }
});

module.exports = router;

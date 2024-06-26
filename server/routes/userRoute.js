const express = require("express");
const router = new express.Router();
const userdb = require("../models/user");
const bcrypt = require("bcryptjs");
const authenticate = require("../middleware/authenticate");

// for user registration
router.post("/register", async (req, res) => {
  const { fname, email, password, cpassword, profilePicture } = req.body;
  if (!fname || !email || !password || !cpassword) {
    return res.status(422).json({ error: "fill all the details" });
  }
  try {
    const preuser = await userdb.findOne({ email: email });
    if (preuser) {
      return res.status(422).json({ error: "This Email is Already Exist" });
    } else if (password !== cpassword) {
      return res.status(422).json({ error: "Password and Confirm Password not match" });
    } else {
      const finalUser = new userdb({
        fname,
        email,
        password,
        cpassword,
        profilePicture
      });
      finalUser.rewardCredits = 10;
      const storeData = await finalUser.save();
      return res.status(201).json({ status: 201, storeData });
    }
  } catch (error) {
    console.log("catch error", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ error: "Fill in all the details" });
  }

  try {
    const userValid = await userdb.findOne({ email });

    if (!userValid) {
      throw new Error("Invalid details");
    }

    if (userValid.status === "blocked") {
      return res.status(422).json({ error: "User account is blocked" });
    }

    const isMatch = await bcrypt.compare(password, userValid.password);

    if (!isMatch) {
      return res.status(422).json({ error: "Invalid details" });
    }

    const token = await userValid.generateAuthtoken();

    res.cookie("usercookie", token, {
      expires: new Date(Date.now() + 9000000),
      httpOnly: true,
    });

    const result = {
      userValid,
      token,
    };

    return res.status(201).json({ status: 201, result });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// user valid
router.get("/validuser", authenticate, async (req, res) => {
  try {
    const ValidUserOne = await userdb.findOne({ _id: req.userId });
    res.status(201).json({ status: 201, ValidUserOne });
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
});

// user logout
router.get("/logout", authenticate, async (req, res) => {
  try {
    req.rootUser.tokens = req.rootUser.tokens.filter((curelem) => {
      return curelem.token !== req.token;
    });

    res.clearCookie("usercookie", { path: "/" });

    res.status(201).json({ status: 201 });
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
});

// get all users
router.get("/get-users", authenticate, async (req, res) => {
  try {
    const users = await userdb.find();
    res.send({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// update user status
router.put("/update-user-status/:id", authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    await userdb.findByIdAndUpdate(req.params.id, { status });
    res.send({
      success: true,
      message: "User status updated successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// get profile image
router.get("/get-profile-image", authenticate, async (req, res) => {
  try{
    const user = req.rootUser;
    const profImg = user.profilePicture;
    console.log("user", user);
    console.log("proooooo", profImg);
    res.send({
      success: true,
      profImg
    });
  }catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

router.get("/get-admin-id", authenticate, async (req, res) => {
  try{
    const user = await userdb.findOne({role:"admin"}, {_id:1});
    const adminUserId = user ? user._id : null;
    res.send({
      success: true,
      adminUserId
    });
  }catch(error){
    res.send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;

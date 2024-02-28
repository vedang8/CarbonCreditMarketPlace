const router = require("express").Router();
const SellCreditForm = require("../models/sellCreditForm");
const authenticate = require("../middleware/authenticate");
const sell_creditforms = require("../models/sellCreditForm");
const cloudinary = require("../db/cloudinaryConn");
const { ObjectId } = require("mongoose").Types;
const mongoose = require("mongoose");
const { uploadImageCloudinary } = require("../db/uploadClodinary");
const userdb = require("../models/user");
const creditdb = require("../models/credits");
const { serialize } = require("v8");

// create a new sell credit form
router.post("/sell-credit-forms", authenticate, async (req, res) => {
  const user = req.rootUser; // Assuming you have a valid user object in req.rootUser
  const formDataWithUser = {
    ...req.body, // Assuming your form data is in the req.body
    user: user._id,
  };
  try {
    const newForm = new SellCreditForm(formDataWithUser);
    await newForm.save();
    res.send({
      success: true,
      message: "Form Submitted Successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// get all sell credit forms of all
router.get("/get-all-sell-credit-forms", authenticate, async (req, res) => {
  try {
    const forms = await sell_creditforms
      .find()
      .populate("user", "fname")
      .sort({ createdAt: -1 });
    res.send({
      success: true,
      forms,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// get sell form by id
router.get("/get-sell-credit-by-id/:id", authenticate, async(req, res) => {
  try{
    const credit = await SellCreditForm.findById(req.params.id).populate("user"); 
    res.send({
      success: true,
      data: credit,
    });
  }catch(error){
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// get sell forms of logged in user
router.get("/get-sell-credit-forms", authenticate, async (req, res) => {
  try {
    const user = req.rootUser;
    const userId = user._id;
    // Fetch forms associated with the specified user ID
    const forms = await sell_creditforms
      .find({ user: userId })
      .sort({ createdAt: -1 });

    // Check if any forms were found
    if (!forms || forms.length === 0) {
      return res.send({
        success: false,
        message: "No credit forms found for the specified user ID.",
      });
    }

    // Return the found forms
    console.log("forms", forms);
    res.send({
      success: true,
      data: forms,
    });
  } catch (error) {
    console.error("Error in fetching sell credit forms: ", error);
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// update form status
router.put("/update-sell-credits-forms-status/:id", authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    await SellCreditForm.findByIdAndUpdate(req.params.id, { status });
    res.send({
      success: true,
      message: "Form status updated Successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
}
);

module.exports = router;

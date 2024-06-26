const express = require("express");
const router = new express.Router();
const Bid = require("../models/bid");
const authenticate = require("../middleware/authenticate");

// place a new bid
router.post("/place-new-bid", authenticate, async (req, res) => {
  const user = req.rootUser; // Assuming you have a valid user object in req.rootUser
  user.rewardCredits += 5;
  await user.save();
  const form = {
    ...req.body, // Assuming your form data is in the req.body
    buyer: user._id,
  };
  try {
    const newBid = new Bid(form);
    await newBid.save();
    res.send({ success: true, message: "Bid placed successfully" });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
});

// get all bids
router.post("/get-all-bids-for-all-users", authenticate, async (req, res) => {
  try {
    const { selectedSellCredit} = req.body;
    console.log("sss", selectedSellCredit);
    let filters = {};
    if (selectedSellCredit) {
      filters.sellCredits = selectedSellCredit.data._id;
      filters.seller = selectedSellCredit.data.user;
    }
    console.log("filters", filters);
    const bids = await Bid.find(filters)
      .populate("sellCredits")
      .populate("buyer")
      .populate("seller")
      .sort({ createdAt: -1 });
    res.send({ success: true, data: bids });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
});

router.post("/get-particular-all-bids", authenticate, async (req, res) => {
  const user = req.rootUser;
  try {
    const { selectedSellCredit} = req.body;
    console.log("sss", selectedSellCredit);
    let filters = {};
    if (selectedSellCredit) {
      filters.sellCredits = selectedSellCredit._id;
      filters.seller = selectedSellCredit.user;
    }
    console.log("filters", filters);
    const bids = await Bid.find(filters)
      .populate("sellCredits")
      .populate("buyer")
      .populate("seller")
      .sort({ createdAt: -1 });
    res.send({ success: true, data: bids });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
});

router.post("/get-all-user-bids", authenticate, async(req, res) => {
  const user = req.rootUser;
  let filter = {};
  filter.buyer = user._id;
  try{
    const bids = await Bid.find(filter).populate("seller").populate("sellCredits").sort({ createdAt: -1 });
    console.log("bbbbb", bids);
    res.send({ success: true, data: bids });
  }catch(error){
    res.send({success: false, message: error.message});
  }
});
module.exports = router;

const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keysecret = "vedangjoshishaileshjoshipravinku";

const userSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("not valid email");
      }
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  cpassword: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    default: "user",
  },
  status: {
    type: String,
    default: "active",
  },
  profilePicture: {
    type: String,
    default: "",
  },
  credits: {
    type: Number,
    default: 0,
  },
  rewardCredits: {
    type: Number,
    default: 0,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
}, {
    timestamps: true,
  });

// hash passsword
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
    this.cpassword = await bcrypt.hash(this.cpassword, 12);
  }

  next();
});

// token generation
userSchema.methods.generateAuthtoken = async function () {
  try {
    let token1 = jwt.sign({ _id: this._id }, keysecret, {
      expiresIn: "1d",
    });
    this.tokens = this.tokens.concat({ token: token1 });
    await this.save();
    return token1;
  } catch (error) {
    res.status(422).json(error);
  }
};

// creating model
const userdb = new mongoose.model("users", userSchema);

module.exports = userdb;

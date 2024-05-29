import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your Name!"],
    minLength: [3, "Name must contain at least 3 Characters!"],
    /*Or Some minimum Length value of charaters*/
    maxLength: [30, "Name cannot exceed 30 Characters!"],
    /*Or Some Maximum value of characters*/
  },
  email: {
    type: String,
    required: [true, "Please enter your Email!"],
    validate: [validator.isEmail, "Please provide a valid Email!"],
    unique: [true, "Pleasen provide a unique email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter the Password"],
    validate: {
      validator: function (value) {
        return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,15}$/.test(value);
      },
      message: (props) =>
        `${props.value} is not a valid password! Password must be 6-15 characters long and contain at least one digit, one lowercase letter, one uppercase letter, and one special character.`,
    },
    select: false,
  },
  phone: {
    type: Number,
    required: [true, "Please enter your Phone Number!"],
  },
  country: {
    type: String,
    required: [true, "Please select your country"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: String,
    select: false,
  },
  otpExpires: {
    type: Date,
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
userSchema.methods.getJWTToken = function () {
  console.log(this._id);
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "15d",
  });
};
export const User = mongoose.model("User", userSchema, "User");

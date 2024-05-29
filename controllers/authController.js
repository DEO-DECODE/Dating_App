import { errorHandler } from "../middlewares/errorHandler.js";
import { User } from "../models/userModel.js";
import { sendToken } from "../utils/sendToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";
export const register = async (req, res, next) => {
  try {
    const { name, password, phone, country, email } = req.body;
    if (!name || !password || !phone || !country || !email) {
      return next(errorHandler(400, "Please fill all the mandatory fields"));
    }

    const isExist = await User.findOne({ email });
    if (isExist) {
      return next(errorHandler(400, "Email is already registered"));
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

    const user = new User({
      name,
      email,
      password,
      phone,
      country,
      otp,
      otpExpires,
    });

    await user.save();

    const subject = "Email Verification";
    const content = `<p>Your OTP for email verification is <b>${otp}</b>. It is valid for 10 minutes.</p>`;
    await sendEmail(user.email, subject, content);

    res.status(200).json({
      success: true,
      message: "OTP sent to your email, please verify",
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(
        errorHandler(400, "Please provide email and password to login")
      );
    }

    const user = await User.findOne({ email }).select(
      "+password +isVerified +otpExpires"
    );
    if (!user) {
      return next(errorHandler(400, "User with this email does not exist"));
    }

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
      return next(errorHandler(400, "Invalid email or password"));
    }

    if (!user.isVerified) {
      if (user.otpExpires && user.otpExpires < Date.now()) {
        await User.deleteOne({ _id: user._id });
        return next(
          errorHandler(403, "Email verification failed, user deleted")
        );
      }
      return next(errorHandler(403, "Email not verified"));
    }

    sendToken(user, 201, res, "Login Successfully", next);
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return next(errorHandler(400, "Please provide email and OTP"));
    }

    const user = await User.findOne({ email }).select("+otp +otpExpires");
    if (!user) {
      return next(errorHandler(400, "Invalid email or OTP"));
    }

    if (user.otpExpires < Date.now()) {
      return next(errorHandler(400, "OTP has expired"));
    }

    if (user.otp !== otp) {
      return next(errorHandler(400, "Invalid OTP"));
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    next(error);
  }
};

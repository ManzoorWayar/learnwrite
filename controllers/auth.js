import jwt from "jsonwebtoken";
import speakeasy from "speakeasy";
import User from "../models/User.js";
import asyncHandler from "express-async-handler";

// @desc    Auth User & get token
// @route   POST /api/v1/auth/login
// @access  Public
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Check for User
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    res.status(403);
    return next(new Error("invalid credentials"));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new Error("invalid credentials"));
  }
  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();

  const options = {
    httpOnly: true, //accessible only by web server
    secure: process.env.NODE_ENV === "production", //https
    sameSite: "Lax", //cross-site cookie
    maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
  };

  res.status(200).cookie("user_token", refreshToken, options).json({
    user,
    accessToken,
  });
});

// @desc    Signup users
// @route   POST /api/v1/auth/signup
// @access  Public
const signup = asyncHandler(async (req, res) => {
  const { body } = req;
  // Check for client-users
  const user = await User.create({
    email: body["email"],
    password: body["password"],
  });

  if (!user) {
    res.statusCode = 500;
    throw new Error("Failed to create user.");
  }

  await user.sendEmailVerificationToken();

  res.json({
    id: user["_id"] || null,
    email: user["email"] || null,
  });
});

// @desc      Log User out / clear cookie
// @route     GET /api/v1/auth/logout
// @access    Private
const logout = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.user_token) return res.sendStatus(204); //No content

  const options = {
    httpOnly: true, //accessible only by web server
    sameSite: "Lax", //cross-site cookie
    secure: process.env.NODE_ENV === "production", //https
  };

  res.clearCookie("user_token", options);

  res.json({ message: "Cookie cleared" });
};

// @desc      Log User out / clear cookie
// @route     GET /api/v1/auth/logout
// @access    Private
const refresh = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.user_token)
    return res.status(401).json({ message: "no cookie Unauthorized" });

  const refreshToken = cookies.user_token;

  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET,
    async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });

      const foundUser = await User.findById(decoded.id).exec();

      if (!foundUser) return res.status(401).json({ message: "Unauthorized" });

      const accessToken = await foundUser.generateAccessToken();

      res.json({
        id: foundUser._id,
        accessToken,
      });
    }
  );
};

// @desc      Verify Email token
// @route     PUT /api/v1/auth/verify
// @access    Public
const verifyEmail = asyncHandler(async (req, res) => {
  const { body } = req;

  const user = await User.findOne({ email: body.email })
    .select("+update_secret")
    .exec();

  if (!user) {
    throw new Error("Email not found!");
  }

  if (user.verifiedAt) {
    throw new Error("Email already verified");
  }

  const verify = user.verifyEmailVerificationToken(body.token);

  if (!verify) {
    throw new Error("Invalid Token!");
  }

  user.verifiedAt = new Date();

  await user.save();

  const accessToken = await user.handleLogin();

  return res.json({
    id: user["_id"] || null,
    email: user["email"] || null,
    verifiedAt: user["verifiedAt"] || null,
    accessToken,
  });
});

// @desc    resend token to user
// @route   POST /api/v1/auth/resend-token
// @access  Public
const resendToken = asyncHandler(async (req, res) => {
  const { body } = req;
  const user = await User.findOne({ email: body.email })
    .select("+update_secret")
    .exec();

  if (user.verifiedAt) {
    throw new Error("Email already verified");
  }

  await user.sendEmailVerificationToken();

  res.json({
    id: user["_id"] || null,
    email: user["email"] || null,
  });
});

export default {
  login,
  refresh,
  verifyEmail,
  logout,
  signup,
  resendToken,
};

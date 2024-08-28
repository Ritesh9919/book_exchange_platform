import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return next(new ApiError("name, email and password is required", 400));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ApiError("user already exist", 409));
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    const registeredUser = await User.findById(user._id).select("-password");
    return res
      .status(201)
      .json(
        new ApiResponse(true, "user register successfully", registeredUser)
      );
  } catch (error) {
    console.error("error in authController registerUser api", error.message);
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ApiError("email and password is required", 400));
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return next(new ApiError("user not found", 404));
    }

    const isPasswordCurrect = await existingUser.comparePassword(password);
    if (!isPasswordCurrect) {
      return next(new ApiError("password is incurrect", 401));
    }

    const token = await existingUser.generateAccessToken();
    const loginUser = await User.findById(existingUser._id).select("-password");

    return res
      .status(200)
      .json(new ApiResponse(true, "Login successfully", { loginUser, token }));
  } catch (error) {
    console.error("error in authController loginUser api", error.message);
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
  } catch (error) {
    console.error("error in authController logoutUser api", error.message);
    next(error);
  }
};

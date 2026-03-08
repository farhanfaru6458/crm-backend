import User from "../models/User.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, "firstName lastName email role");
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

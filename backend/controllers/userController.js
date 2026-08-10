const User = require("../models/userModel");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).json({
      status: "success",
      numUsers: users.length,
      data: {
        users,
      },
    });
  } catch (err) {
    return next(err);
  }
};

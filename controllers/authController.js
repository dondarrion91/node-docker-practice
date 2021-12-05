const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

exports.signUp = async (req, res) => {
  const { username, password } = req.body;

  try {
    const newUser = await User.create({
      username,
      password: await bcrypt.hash(password, 12),
    });
    req.session.user = newUser;
    res.status(201).json({
      status: "success",
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
    });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid credentials",
      });
    }
    req.session.user = user;
    res.status(201).json({
      status: "success",
      data: {
        user: "Login successfull",
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
    });
  }
};

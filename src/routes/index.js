const router = require("express").Router();
const User = require("../models/user");

const getUser = async (req, res, next) => {
  let user;
  const { id } = req.params;
  try {
    user = await User.findById(id);
    if (user == null) {
      return res.status(404).json({ message: "Cannot find User" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.user = user;
  next();
};
router.get("/", (req, res, next) => {
  res.status(200).json({ msg: "working..." });
});
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/users", async (req, res) => {
  const { name, password } = req.body;
  const user = new User({
    name,
    password,
  });
  try {
    const newUser = await user.save();
    res.status(201).json({ newUser });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/users/:id", getUser, (req, res) => {
  res.json(res.user);
});
module.exports = router;

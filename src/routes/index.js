const router = require("express").Router();
const User = require("../models/user");

router.get("/", (req, res, next) => {
  res.status(200).json({ msg: "working..." });
});
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
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
module.exports = router;

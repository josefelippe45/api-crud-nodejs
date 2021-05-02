const router = require('express').Router();
const User = require('../models/user');
const validateEmail = require('../utils/email');

const getUser = async (req, res, next) => {
  let user;
  const { id } = req.params;
  try {
    user = await User.findById(id);
    if (user == null) {
      return res.status(404).json({ message: 'Cannot find User' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.user = user;
  next();
};

router.get('/', (_, res) => {
  res.status(200).json({ msg: 'working...' });
});
router.get('/users', async (_, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/users', async (req, res, next) => {
  const { name, password, email } = req.body;
  const user = new User({
    name,
    password,
    email,
  });
  try {
    if (!validateEmail(email)) {
      res.status(400).send('Invalid email');
      next();
    } else {
      const newUser = await user.save();
      res.status(201).json({ newUser });
    }
  } catch (err) {
    next(err);
  }
});

router.get('/users/:id', getUser, (_, res) => {
  res.json(res.user);
});

router.put('/users/:id', getUser, async (req, res, next) => {
  const { email } = req.body;
  try {
    if (!validateEmail(email)) res.status(400).send('Invalid email');
    else {
      const updatedData = await res.user.save();
      res.json(updatedData);
    }
  } catch (err) {
    next(err);
  }
});

router.delete('/users/:id', getUser, async (_, res) => {
  try {
    await res.user.deleteOne();
    res.json({ message: 'Data deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/users/:id', getUser, async (req, res, next) => {
  const { name, password, email } = req.body;
  if (name != null) {
    res.user.name = name;
  }
  if (password != null) {
    res.user.password = password;
  }
  if (email != null) {
    res.user.email = email;
  }
  try {
    if (!validateEmail(email)) res.status(400).send('Invalid email');
    else {
      const updatedData = await res.user.save();
      res.json(updatedData);
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;

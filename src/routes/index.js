const router = require('express').Router();
const User = require('../models/user');
const validateEmail = require('../utils/email');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticate = require('../authentication');

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
router.get('/users', authenticate, async (_, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/register', async (req, res, next) => {
  const { name, password, email } = req.body;

  const userExists = await User.findOne({ name });
  if (userExists)
    return res.status(400).send({ error: 'Username already in use.' });

  const emailExists = await User.findOne({ email });
  if (emailExists)
    return res.status(400).send({ error: 'Email already in use.' });

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = new User({
    name,
    password: hash,
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
router.post('/login', async (req, res, next) => {
  try {
    const { password, email } = req.body;
    const userExists = await User.findOne({ email });

    if (!userExists) return res.status(400).send({ error: 'User not found' });

    const validatePassword = await bcrypt.compare(
      password,
      userExists.password
    );

    if (!validatePassword)
      return res.status(400).send({ error: 'Invalid Password' });

    const token = jwt.sign({ _id: userExists.id }, process.env.SECRET);

    return res.header('auth-token', token).send({ token });
  } catch (err) {
    res.status(400);
    next(err);
  }
});
router.get('/users/:id', authenticate, getUser, (_, res) => {
  res.json(res.user);
});

router.put('/users/:id', authenticate, getUser, async (req, res, next) => {
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

router.delete('/users/:id', authenticate, getUser, async (_, res) => {
  try {
    await res.user.deleteOne();
    res.json({ message: 'Data deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/users/:id', authenticate, getUser, async (req, res, next) => {
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

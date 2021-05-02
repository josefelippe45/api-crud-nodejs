const router = require('express').Router();
const User = require('../models/user');

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
  const { name, password } = req.body;
  const user = new User({
    name,
    password,
  });
  try {
    const newUser = await user.save();
    res.status(201).json({ newUser });
  } catch (err) {
    next(err);
  }
});

router.get('/users/:id', getUser, (_, res) => {
  res.json(res.user);
});

router.put('/users/:id', getUser, async (req, res, next) => {
  try {
    const updateData = await res.user.set(req.body);
    res.json(updateData);
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
  const { name, password } = req.body;
  if (name != null) {
    res.user.name = name;
  }
  if (password != null) {
    res.user.password = password;
  }
  try {
    const updatedData = await res.user.save();
    res.json(updatedData);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

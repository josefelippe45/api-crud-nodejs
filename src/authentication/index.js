const jwt = require('jsonwebtoken');

const validateJwt = async (req, res, next) => {
  try {
    const jsonToken = req.header('auth_token');
    if (!jsonToken) return res.status(400).send({ error: 'Access denied' });
    const tokenVerified = await jwt.verify(jsonToken, process.env.SECRET);
    req.user = tokenVerified;
    return next();
  } catch (error) {
    res.status(400).send({ error: 'Invalid token' });
    return next(error);
  }
};

module.exports = validateJwt;

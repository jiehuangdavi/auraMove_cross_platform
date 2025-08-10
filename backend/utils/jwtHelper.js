const jwt = require('jsonwebtoken');

/**
 * Generates a JWT for a given user.
 * @param {object} user - The user object, must contain an `id`.
 * @returns {string} The generated JWT.
 */
const generateToken = (user) => {
  const payload = { user: { id: user.id } };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = { generateToken };
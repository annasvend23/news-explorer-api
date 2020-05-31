const jsonwebtoken = require('jsonwebtoken');

const UnauthorizedError = require('../errors/unauthorized-err');

const { JWT_SECRET } = require('../config/config');
const { AUTHORIZATION_REQUIRED } = require('../config/constants');

module.exports = (req, res, next) => {
  const { jwt } = req.cookies;

  if (!jwt) {
    throw new UnauthorizedError(AUTHORIZATION_REQUIRED);
  }

  let payload;

  try {
    payload = jsonwebtoken.verify(jwt, JWT_SECRET);
  } catch (err) {
    return next(new UnauthorizedError(AUTHORIZATION_REQUIRED));
  }

  req.user = payload;

  return next();
};

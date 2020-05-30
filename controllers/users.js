const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');

const { JWT_SECRET, HOST } = require('../config/config');
const { MIN_PASSWORD_LENGTH } = require('../config/constants');

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' },
      );

      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
          domain: HOST,
        })
        .cookie('isAuthorized', true, {
          maxAge: 3600000 * 24 * 7,
          sameSite: true,
          domain: HOST,
        })
        .send({});
    })
    .catch(next);
};

const logout = (req, res) => res
  .cookie('jwt', '', {
    maxAge: 0,
    httpOnly: true,
    sameSite: true,
    domain: HOST,
  })
  .cookie('isAuthorized', false, {
    maxAge: 0,
    sameSite: true,
    domain: HOST,
  })
  .send({});

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    throw BadRequestError(`Минимальная длина пароля ${MIN_PASSWORD_LENGTH} символов`);
  }

  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => {
      res
        .status(201)
        .send({
          data: {
            _id: user._id, name, email,
          },
        });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new BadRequestError('Пользователь с такой почтой уже есть в базе'));
      }
      return next(err);
    });
};

const getUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (user) {
        res.send({ data: { email: user.email, name: user.name } });
      } else {
        throw new NotFoundError('Нет пользователя с таким id');
      }
    })
    .catch(next);
};

module.exports = {
  login, logout, createUser, getUser,
};

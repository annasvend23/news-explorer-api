const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-err');
const { NOT_FOUND_ERROR } = require('../config/constants');

const usersRouter = require('./users');
const articlesRouter = require('./articles');
const { login, createUser, logout } = require('../controllers/users');

router.use('/users', auth, usersRouter);
router.use('/articles', auth, articlesRouter);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

router.post('/signout', auth, logout);
router.use('*', () => {
  throw new NotFoundError(NOT_FOUND_ERROR);
});

module.exports = router;

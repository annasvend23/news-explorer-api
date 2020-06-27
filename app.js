require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('cors');

const router = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { errorHandler } = require('./middlewares/errors-handler');
const limiter = require('./helpers/limiter');

const { FRONTEND_HOST, PORT, MONGO_URL } = require('./config/config');

const app = express();

app.use(cors({ credentials: true, origin: [`http://${FRONTEND_HOST}`, `https://${FRONTEND_HOST}`, 'https://annasvend23.github.io'] }));
app.use(helmet());
app.use(cookieParser());

app.use(limiter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(requestLogger);

app.use(router);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.warn(`App listening on port ${PORT}`);
});

const {
  NODE_ENV, JWT_SECRET, HOST, FRONTEND_HOST, PORT, MONGO_URL,
} = process.env;

module.exports = {
  NODE_ENV: NODE_ENV || 'development',
  JWT_SECRET: JWT_SECRET || 'dev-secret',
  HOST,
  FRONTEND_HOST,
  PORT: PORT || 3000,
  MONGO_URL: MONGO_URL || 'mongodb://localhost:27017/diploma',
};

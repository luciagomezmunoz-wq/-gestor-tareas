
require('dotenv').config();

const config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  dbFilename: process.env.DB_FILENAME || './database.sqlite',
  jwtSecret: process.env.JWT_SECRET
};

module.exports = config;

require('dotenv').config();
const path = require('path');

const env = process.env.NODE_ENV || 'development';

const config = {
  env,
  port: Number(process.env.PORT) || 3000,
  baseUrl: process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`,
  mongo: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/miinventario',
    options: {}
  },
  session: {
    secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
    cookie: {
      maxAge: Number(process.env.SESSION_MAX_AGE) || 1000 * 60 * 60 * 24,
      secure: env === 'production',
      sameSite: env === 'production' ? 'lax' : 'lax'
    }
  },
  upload: {
    dir: path.resolve(process.cwd(), process.env.UPLOAD_DIR || 'public/uploads'),
    maxFileSize: Number(process.env.UPLOAD_MAX_BYTES) || 2 * 1024 * 1024
  },
  bcrypt: {
    saltRounds: Number(process.env.SALT_ROUNDS) || 10
  },
  logLevel: process.env.LOG_LEVEL || 'info'
};

module.exports = config;

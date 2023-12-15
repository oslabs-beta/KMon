const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const authRouters = require('./routes/authRouters.js');
const pool = require('./models/db.js');
const cors = require('cors');
const crypto = require('crypto');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Create express server
const app = express();

// Middleware before the session middleware
app.use(cookieParser());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Ensure .env file is included / Generate a secret for the session
const secret = process.env.NODE_ENV === 'production'
  ? process.env.SESSION_SECRET
  : crypto.randomBytes(64).toString('hex');

/* The connection pool is defined in the ./models/db.js file.
When using the db.query method to execute SQL queries in controllers,
it internally calls pool.query, utilizing the connection pool for database interactions. */
app.use((req, res, next) => {
  // console.log('Cookies:', req.cookies);
  req.pool = pool;
  next();
});

// Create a session
app.use(
  session({
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' }
  })
);

// Use routes
app.use('/auth', authRouters);

// Handle unknown routes
app.use((req, res) => res.sendStatus(404));

// Global error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { error: 'An error occured' },
  };
  const errObj = Object.assign({}, defaultErr, err);
  if (req.accepts('json')) {
    res.status(errObj.status).json(errObj.message);
  } else {
    res.status(errObj.status).send(errObj.message.error);
  }
});

module.exports = app;

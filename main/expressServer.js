const express = require('express');
const session = require('express-session');
const authRouters = require('./routes/authRouters.js');
const pool = require('./models/db.js');

// Create express server
const app = express();

// Create a session
app.use(
  session({
    secret: 'nyoi8',
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Inject the pool into the request object for easy access in routes
app.use((req, res, next) => {
  req.pool = pool;
  next();
});

// Use routes
app.use('/auth', authRouters);

// Handle unknown routes
app.use((req, res) => res.sendStatus(400));

// Global error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occured' },
  };
  const errObj = Object.assign({}, defaultErr, err);
  if (req.accepts('json')) {
    res.status(errObj.status).json(errObj.message);
  } else {
    // If not JSON, send a plain text response
    res.status(errObj.status).send(errObj.message.err);
  }
});

module.exports = app;

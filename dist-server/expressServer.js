"use strict";

var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var pool = require('./models/db.js');
var cors = require('cors');
var crypto = require('crypto');
var dotenv = require('dotenv');

// require in routers
var authRouters = require('./routes/authRouters.js');
var apiRouters = require('./routes/apiRouters.js');

// Load environment variables from .env file
dotenv.config();

// Create express server
var app = express();

// Middleware before the session middleware
app.use(cookieParser());
app.use(cors());
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());

// Ensure .env file is included / Generate a secret for the session
var secret = process.env.NODE_ENV === 'production' ? process.env.SESSION_SECRET : crypto.randomBytes(64).toString('hex');

// Create a session
app.use(session({
  secret: secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production'
  }
}));

// Use routes
app.use('/auth', authRouters, function (req, res) {});
console.log('expressServer.js - about to hit /api');
app.use('/api', apiRouters, function (req, res) {});

// Handle unknown routes
app.use(function (req, res) {
  return res.sendStatus(404);
});

// Global error handler
app.use(function (err, req, res, next) {
  var defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: {
      error: 'An error occured'
    }
  };
  var errObj = Object.assign({}, defaultErr, err);
  if (req.accepts('json')) {
    res.status(errObj.status).json(errObj.message);
  } else {
    res.status(errObj.status).send(errObj.message.error);
  }
});
module.exports = app;
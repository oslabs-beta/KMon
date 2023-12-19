const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const pool = require("./models/db.js");
const cors = require("cors");
const crypto = require("crypto");
const dotenv = require("dotenv");

// require in routers
const authRouters = require("./routes/authRouters.js");
const apiRouters = require("./routes/apiRouters.js");
const graphRouters = require("./routes/graphRouters.js");;
// const alertRouters = require('./routes/alertRouters.js');

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
const secret =
  process.env.NODE_ENV === "production"
    ? process.env.SESSION_SECRET
    : crypto.randomBytes(64).toString("hex");

// Create a session
app.use(
  session({
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);

// Use routes
app.use('/auth', authRouters);

console.log('expressServer.js - about to hit /api')
app.use('/api', apiRouters);

// app.use('/alert', alertRouters);

// Handle unknown routes
app.use((req, res) => res.sendStatus(404));

// Global error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: "Express error handler caught unknown middleware error",
    status: 500,
    message: { error: "An error occured" },
  };
  const errObj = Object.assign({}, defaultErr, err);
  if (req.accepts("json")) {
    res.status(errObj.status).json(errObj.message);
  } else {
    res.status(errObj.status).send(errObj.message.error);
  }
});

module.exports = app;

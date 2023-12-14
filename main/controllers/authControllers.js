const db = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authControllers = {};

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const isDevelopment = process.env.NODE_ENV === 'development';

authControllers.createUser = async (req, res, next) => {
  try {
    const { first_name, last_name, user_email, user_password } = req.body;

    const checkUserQuery = 'SELECT * FROM users WHERE user_email = $1';
    const checkUserValues = [user_email];
    const existingUser = await db.query(checkUserQuery, checkUserValues);

    if (existingUser.rows.length > 0) {
      return next({
        log: 'Error in authControllers.signup',
        status: 400,
        message: { error: 'Account with this email already exists.' },
      });
    }

    let signupQuery, signupValues;

    const hashedPassword = await bcrypt.hash(user_password, 10);

    if (last_name) {
      signupQuery =
        'INSERT INTO users (first_name, last_name, user_email, user_password) VALUES ($1, $2, $3, $4) RETURNING user_id';
      signupValues = [first_name, last_name, user_email, hashedPassword];
    } else {
      signupQuery =
        'INSERT INTO users (first_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING user_id';
      signupValues = [first_name, user_email, hashedPassword];
    }

    const result = await db.query(signupQuery, signupValues);

    const userID = result.rows[0].user_id;
    console.log('User successfully registered with ID:', userID);
    res.locals.user = userID;
    return next();
  } catch (err) {
    return next({
      log: 'Error in authControllers.signup',
      status: 500,
      message: { error: 'Internal server error' },
    });
  }
};

authControllers.verifyUser = async (req, res, next) => {
  try {
    const user_email = req.body.user_email;
    const user_password = req.body.user_password;

    if (user_email && user_password) {
      const values = [user_email];
      const userQuery =
        'SELECT user_id, user_password FROM users WHERE user_email = $1';
      const result1 = await db.query(userQuery, values);

      if (result1.rows.length > 0) {
        const userID = result1.rows[0].user_id;
        console.log('this is userID from result1.rows:', userID);
        const userDBPassword = result1.rows[0].user_password;

        const isAuthenticated = await bcrypt.compare(
          user_password,
          userDBPassword
        );

        if (isAuthenticated) {
          res.locals.user = userID;
          console.log('User successfully logged in with ID:', userID);
          return next();
        } else {
          res.status(401).json({ error: 'Incorrect password' });
        }
      } else {
        res.status(404).json({ error: "User doesn't exist" });
      }
    } else {
      res
        .status(400)
        .json({ error: 'Please enter email and password details' });
    }
  } catch (err) {
    return next({
      log: 'Error in authControllers.verifyUser',
      status: 500,
      message: { error: 'Internal server error' },
    });
  }
};

authControllers.setSessionCookie = async (req, res, next) => {
  try {
    const userID = res.locals.user;

    const sessionToken = jwt.sign(userID, JWT_SECRET);

    const cookieOptions = {
      httpOnly: true,
      sameSite: 'strict',
    };

    if (!isDevelopment) {
      cookieOptions.secure = true;
    }

    res.cookie('KMonST', sessionToken, cookieOptions);

    return next();
  } catch (err) {
    return next({
      log: 'Error in authControllers.setSessionCookie',
      status: 500,
      message: { error: 'Internal server error' },
    });
  }
};

authControllers.clearSessionCookie = async (req, res, next) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Internal server error' });
      }
      res.clearCookie('KMonST');
      return next();
    });
  } catch (err) {
    return next({
      log: 'Error in authControllers.logout',
      status: 500,
      message: { error: 'Internal server error' },
    });
  }
};

module.exports = authControllers;

const db = require('../models/db');
// const bcrypt = require('bcrypt');

const authControllers = {};

authControllers.signup = async (req, res, next) => {
  try {
    const { first_name, last_name, user_email, user_password } = req.body;

    const checkUserQuery = 'SELECT * FROM users WHERE user_email = $1';
    const checkUserValues = [user_email];
    const existingUser = await db.query(checkUserQuery, checkUserValues);

    if (existingUser.rows.length > 0) {
      return next({
        log: 'Error in authControllers.signup',
        status: 400,
        message: { err: 'User with this email already exists' },
      });
    }

    let signupQuery, signupValues;

    if (last_name) {
      signupQuery =
        'INSERT INTO users (first_name, last_name, user_email, user_password) VALUES ($1, $2, $3, $4) RETURNING user_id';
      signupValues = [first_name, last_name, user_email, user_password];
    } else {
      signupQuery =
        'INSERT INTO users (first_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING user_id';
      signupValues = [first_name, user_email, user_password];
    }

    const result = await db.query(signupQuery, signupValues);

    const userId = result.rows[0].user_id;
    console.log('User successfully registered with ID:', userId);

    res.locals.userId = userId;
    next();
  } catch (err) {
    next({
      log: 'Error in authControllers.signup',
      status: 500,
      message: { err: 'Internal server error' },
    });
  }
};

authControllers.login = async (req, res, next) => {
  try {
    const user_email = req.body.user_email;
    const user_password = req.body.user_password;

    if (user_email && user_password) {
      const values = [user_email, user_password];
      const userQuery =
        'SELECT user_id FROM users WHERE user_email = $1 AND user_password = $2';
      const result1 = await db.query(userQuery, values);
      console.log('this is result1', result1);
      const userId = result1.rows[0]['user_id'];
      console.log('this is result1.rows:', userId);
      res.locals.userId = userId;
      next();
    } else {
      res.send('Please enter email and password details');
      res.end();
    }
  } catch (err) {
    next({
      log: 'Error in authControllers.login',
      status: 400,
      message: { err: "User doesn't exist" },
    });
  }
};

authControllers.logout = async (req, res, next) => {
  try {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          next(err);
        }
      });
    }
  } catch (err) {
    next({
      log: 'Error in authControllers.logout',
      status: 400,
      message: { err: "Logout invalid" },
    });
  }
};

module.exports = authControllers;

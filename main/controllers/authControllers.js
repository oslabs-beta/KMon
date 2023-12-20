const Store = require("electron-store");
const db = require("../models/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

const authControllers = {};
// Initialize electron-store
const store = new Store();

// Ensure .env file is included
const JWT_SECRET = process.env.JWT_SECRET || "secret";
const isDevelopment = process.env.NODE_ENV === "development";

// Create a new user in db
authControllers.createUser = async (req, res, next) => {
  try {
    const { first_name, last_name, user_email, user_password } = req.body;

    // Query to check if account with the provided email exists, and if so, return
    const checkUserQuery = "SELECT * FROM users WHERE user_email = $1";
    const checkUserValues = [user_email];
    const existingUser = await db.query(checkUserQuery, checkUserValues);

    if (existingUser.rows.length > 0) {
      return next({
        log: "Error in authControllers.createUser",
        status: 400,
        message: { error: "Account with this email already exists." },
      });
    }

    let signupQuery, signupValues;

    const hashedPassword = await bcrypt.hash(user_password, 10);

    // Different queries to insert new user info depending on whether user has provided last name
    if (last_name) {
      signupQuery =
        "INSERT INTO users (first_name, last_name, user_email, user_password) VALUES ($1, $2, $3, $4) RETURNING user_id";
      signupValues = [first_name, last_name, user_email, hashedPassword];
    } else {
      signupQuery =
        "INSERT INTO users (first_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING user_id";
      signupValues = [first_name, user_email, hashedPassword];
    }

    const result = await db.query(signupQuery, signupValues);

    const userID = result.rows[0].user_id;
    // console.log('User successfully registered with ID:', userID);
    res.locals.user = userID;
    return next();
  } catch (err) {
    return next({
      log: "Error in authControllers.createUser",
      status: 500,
      message: { error: "Internal server error" },
    });
  }
};

// Verify user when login
authControllers.verifyUser = async (req, res, next) => {
  try {
    const user_email = req.body.user_email;
    const user_password = req.body.user_password;

    // Find the user's info in the db
    if (user_email && user_password) {
      const values = [user_email];
      const userQuery =
        'SELECT user_id, first_name, last_name, user_password, user_email FROM users WHERE user_email = $1';
      const result1 = await db.query(userQuery, values);

      if (result1.rows.length > 0) {
        // const userID = result1.rows[0].user_id;
        const user = {
          userID: result1.rows[0].user_id,
          firstName: result1.rows[0].first_name,
          lastName: result1.rows[0].last_name,
          userEmail: result1.rows[0].user_email,
        };
        // console.log('this is userID from result1.rows:', userID);
        const userDBPassword = result1.rows[0].user_password;

        // Use bcrypt method to compare passwords
        const isAuthenticated = await bcrypt.compare(
          user_password,
          userDBPassword
        );

        if (isAuthenticated) {
          // res.locals.user = userID;
          res.locals.user = user;
          // console.log('User successfully logged in with ID:', userID);
          return next();
        } else {
          res.status(401).json({ error: "Incorrect password" });
        }
      } else {
        res.status(404).json({ error: "User doesn't exist" });
      }
    } else {
      res
        .status(400)
        .json({ error: "Please enter email and password details" });
    }
  } catch (err) {
    return next({
      log: "Error in authControllers.verifyUser",
      status: 500,
      message: { error: "Internal server error" },
    });
  }
};

// Set session cookie when login or signup
authControllers.setSessionCookie = async (req, res, next) => {
  try {
    // const userID = res.locals.user;
    const user = res.locals.user;

    // Use the JWT method sign, which takes the payload and secret as its arguments. The generated token is a string.
    // TO DO: Add options such as expiresIn as needed for production env.
    const sessionToken = jwt.sign({ userID: user.userID }, JWT_SECRET);

    // Store the token locally
    store.set("sessionToken", sessionToken);

    // Specify the following properties when creating a cookie
    // TO DO: specify expires property, as needed
    const cookieOptions = {
      httpOnly: true,
      sameSite: "strict",
    };

    if (!isDevelopment) {
      cookieOptions.secure = true;
    }

    // Create the cookie 'KMonST' (aka KMon Session Token)
    res.cookie("KMonST", sessionToken, cookieOptions);

    return next();
  } catch (err) {
    return next({
      log: "Error in authControllers.setSessionCookie",
      status: 500,
      message: { error: "Internal server error" },
    });
  }
};

// TO DO: For production, verify JWT token for protected routes
// authControllers.verifyToken = async (req, res, next) => {
//   // Retrieve the token from local storage
//   const token = store.get('sessionToken');

//   if (!token) {
//     return res.status(401).json({ error: 'Unauthorized' });
//   }

//   try {
//     const { userID } = jwt.verify(token, JWT_SECRET);
//     req.userID = userID;
//     return next();
//   } catch (error) {
//     return res.status(401).json({ error: 'Invalid token' });
//   }
// };

// Clear session cookie when logging out
authControllers.clearSessionCookie = async (req, res, next) => {
  try {
    // Remove the token from local storage
    store.delete("sessionToken");

    // Clear the cookie 'KMonST'
    res.clearCookie("KMonST");

    // Destroy the session created with express-session
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Internal server error" });
      }

      // Clear the session cookie 'connect.sid'
      res.clearCookie("connect.sid");

      return next();
    });
  } catch (err) {
    return next({
      log: "Error in authControllers.clearSessionCookie",
      status: 500,
      message: { error: "Internal server error" },
    });
  }
};

module.exports = authControllers;

// ./models/db.js file defines a connection pool
const { Pool } = require('pg');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Ensure .env file is included
// For saving the database URI in the env file instead:
const pool = new Pool({ connectionString: process.env.DB_URI });

pool
  .connect()
  .then(() => {
    console.log('Database is connected');
  })
  .catch((error) => {
    console.log('Database connection error: ', error);
  });

// Exports an object with a query method
module.exports = {
  // The query method logs the executed query and then calls pool.query to execute the actual database query
  query: (text, params, callback) => {
    console.log('Executed Query: ', text);
    return pool.query(text, params, callback);
  },
};

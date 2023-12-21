// ./models/db.js file defines a connection pool
const { Pool } = require("pg");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// Ensure .env file is included
// For saving the database URI in the env file instead:
const pool = new Pool({ connectionString: process.env.DB_URI2 });

//const createTables = async () => {
  pool
    .connect()
    .then(() => {
      console.log("Database is connected");
      // console.log(process.env.DB_URI2)
    })
    .catch((error) => {
      console.log("Database connection error: ", error);
    });

//to creat a new graph table:
//   await pool.query(
//     `
    // CREATE TABLE IF NOT EXISTS graphs (
    // user_id INTEGER REFERENCES users (user_id), 
    // graph_id INTEGER PRIMARY KEY, 
    // metric_name VARCHAR(255));`,
//     (err, result) => {
//       if (err) {
//         console.error("Error creating the graph table:", err);
//       } else {
//         console.log("Graph table created successfully");
//       }
//     }
//   );
// };
//createTables()

// Exports an object with a query method
module.exports = {
  // The query method logs the executed query and then calls pool.query to execute the actual database query
  query: (text, params, callback) => {
    console.log("Executed Query: ", text);
    return pool.query(text, params, callback);
  },
  
};

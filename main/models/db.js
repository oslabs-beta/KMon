const { Pool } = require('pg');
// require('dotenv').config();

// For saving the database URI in the env file instead
// const pool = new Pool({ connectionString: process.env.DB_URI });

const pool = new Pool({
  connectionString:
    'postgres://gmasbmxl:R44JPMUT3LjuZqZ2Hcmn2A65P4k2Lv-B@berry.db.elephantsql.com/gmasbmxl',
});

pool
  .connect()
  .then(() => {
    console.log('Database is connected');
  })
  .catch((error) => {
    console.log('Database connection error: ', error);
  });

module.exports = {
  query: (text, params, callback) => {
    console.log('Executed Query: ', text);
    return pool.query(text, params, callback);
  },
};

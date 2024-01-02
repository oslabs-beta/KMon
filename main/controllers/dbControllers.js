const db = require("../models/db");
const bcrypt = require('bcrypt');

const dbControllers = {};

// postgres - Connections:
// db: clusterID, userID, clusterName, seedBrokers, created_on
// primary key: clusterID + userID


dbControllers.saveConnection = async (req, res, next) => {

  try {
    const { id, name, created, userID, apiKey, apiSecret } = req.body;
    const { brokers } = res.locals;

    const brokersJSON = JSON.stringify(brokers);
    const query = 'INSERT INTO "Connections" (cluster_id, user_id, cluster_name, brokers, created_on, api_key, api_secret) VALUES ($1, $2, $3, $4, $5, $6, $7)';
    const values = [id, userID, name, brokersJSON, created, apiKey, apiSecret]

    const dbResponse = await db.query(query, values);

    return next();
  }
  catch (error) {
    const err = Object.assign({}, {
      log: 'Error occurred while saving connection to database',
      status: 500,
      message: "Couldn't save to database"
    }, error)
    return next(err);
  }
}

dbControllers.getConnections = async (req, res, next) => {
  try {

    const userid = req.params.userid;

    const query = 'SELECT * FROM "Connections" WHERE user_id=$1';
    const value = [userid]

    const response = await db.query(query, value);

    const data = response.rows
    res.locals.data = data;
    return next();
  }
  catch (error) {
    const err = Object.assign({}, {
      log: 'Error occurred while getting connections from database',
      status: 500,
      message: "Couldn't get from database"
    }, error)
    return next(err);
  }
}

dbControllers.deleteConnections = async (req, res, next) => {

  try {
    // req.body should contain two pieces of information: userid and the array of ports.
    const { userid, clusters } = req.body;
    // we'll first delete those particular rows from the database

    const clustersQuery = clusters.map((node, index) => {
      return `$${index + 2}`
    })

    const clustersQueryStr = clustersQuery.join(', ')

    const query = `DELETE FROM "Connections" WHERE (user_id=$1 AND cluster_id IN (${clustersQueryStr}))`
    const values = [userid, ...clusters];

    const dbResponse = await db.query(query, values)

    res.locals.dbResponse = dbResponse;

    return next();
  }
  catch (error) {
    const err = Object.assign({}, {
      log: 'Error occurred while deleting connections from database',
      status: 500,
      message: "Couldn't delete from database"
    }, error)
    return next(err);
  }
}

module.exports = dbControllers;
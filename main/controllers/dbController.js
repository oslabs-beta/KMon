const db = require("../models/db");

const dbController = {};

// postgres - Connections:
// db: clusterID, userID, clusterName, ports, created_on
// primary key: clusterID + userID


dbController.saveConnection = async (req, res, next) => {

  try {
    const { id, name, uri, ports, created, userID } = req.body;

    const portsJSON = JSON.stringify(ports);
    const query = 'INSERT INTO "Connections" (cluster_id, user_id, cluster_name, cluster_uri, ports, created_on) VALUES ($1, $2, $3, $4, $5, $6)';
    const values = [id, userID, name, uri, portsJSON, created]

    const response = await db.query(query, values);

    res.locals.response = response;
    return next();

  }
  catch (error) {
    console.error(error);
    return next(error);
  }
}

dbController.getConnections = async (req, res, next) => {
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
    console.error(error);
    return next(error);

  }
}

dbController.deleteConnections = async (req, res, next) => {

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
    const err = Object.assign({}, error, {
      log: 'Error occurred while deleting connections from database',
      status: 500,
      message: "Couldn't delete from database"
    })
    return next(error);
  }
}

module.exports = dbController;
const db = require("../models/db");
const Store = require('electron-store');
const fs = require('fs');
const path = require('path');
const { exec } = require('node:child_process');

const dbController = {};

// postgres - Connections:
// db: clusterID, userID, clusterName, ports, created_on
// primary key: clusterID + userID


dbController.saveConnection = async (req, res, next) => {
  console.log('dbController - req.body: ', req.body);
  try {
    const {id, name, uri, ports, created, userID} = req.body;

    // Check for duplicate host:ports in the database and return an error if so.
    const checkQuery = 'SELECT * FROM "Connections" WHERE cluster_uri=$1'
    const checkValue = [uri];

    const checkResponse = await db.query(checkQuery, checkValue);

    let insert = true;

    if (checkResponse.rows.length>1) {
      for (let cluster of checkResponse.rows) {
        for (port of ports) {
          console.log(cluster.ports)
          if (cluster.ports.includes(port)) insert = false;
        }
      }
    }
    if (insert) {
    const portsJSON = JSON.stringify(ports);
    const query = 'INSERT INTO "Connections" (cluster_id, user_id, cluster_name, cluster_uri, ports, created_on) VALUES ($1, $2, $3, $4, $5, $6)';
    const values = [id, userID, name, uri, portsJSON, created]
    
    const response = await db.query(query, values);

    res.locals.response = response;
    return next();
    }
    else {
      const error = {
        log: 'Duplicate connections detected in database, error in dbController.saveConnection',
        status: 409,
        message: {
          error: 'Duplicate connection(s) detected'
        }
      }
      return next(error);
    }
  }
  catch (error) {
    console.error(error);
    return next(error);
  }
}

dbController.getConnections = async (req, res, next) => {
  try {

    // console.log('dbController.getConnections - req.params: ', req.params);
    const userid = req.params.userid;
    
    const query = 'SELECT * FROM "Connections" WHERE user_id=$1';
    const value = [userid]
    
    const response = await db.query(query, value);
    // console.log(response);
    const data = response.rows
    res.locals.data = data;
    return next();
  }
  catch (error) {
    console.error(error);
    return next(error);

  }
}

module.exports = dbController;
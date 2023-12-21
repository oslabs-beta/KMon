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
    const portsJSON = JSON.stringify(ports);
    const query = 'INSERT INTO "public"."Connections" (cluster_id, user_id, cluster_name, cluster_uri, ports, created_on) VALUES ($1, $2, $3, $4, $5)';
    const values = [id, userID, name, uri, portsJSON, created]
    
    const response = await db.query(query, values);

    console.log('dbController.saveConnection - response: ', response);
    // const data = response.rows

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
    const {userid} = req.params;
    console.log('dbController.getConnections - req.params: ', req.params);
    console.log(typeof userid)
    const query = 'SELECT * FROM "public"."Connections" WHERE "user_id" = $1';
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
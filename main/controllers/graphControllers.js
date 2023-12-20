// const db = require("../models/db");

// const graphControllers = {};

//this middlware creates a graph in graphs table in database 
// graphControllers.createGraph = async (req, res, next) => {
//   try {
//     const { graph_id, metric_name, user_id } = req.body;
//     let graphQuery = `
//         INSERT INTO graphs (graph_id, user_id, metric_name) 
//         VALUES ($1, $2, $3) 
//         RETURNING graph_id
//         `;
//     const result = await db.query(graphQuery, [graph_id, user_id, metric_name]);
//     const graphID = result.rows[0].graph_id;
//     res.locals.graph = graphID;
//     console.log()
//     return next();
//   } catch (err) {
//     return next({
//       log: "Error in graphControllers.createGraph",
//       status: 500,
//       message: { error: "Internal server error" },
//     });
//   }
// };

//this middlware is for getting all graphs for a specific userin graphs table in database 
// graphControllers.getGraphs = async (req, res, next) => {
//   try {
//     const { user_id } = req.query;
//     const graphQuery = `
//       SELECT * FROM graphs WHERE user_id = $1
//     `;
//     const result = await db.query(graphQuery, [user_id]);
//     res.locals.graphs = result.rows;
//   } catch (err) {
//     return next({
//       log: "Error in graphControllers.getGraphs",
//       status: 500,
//       message: { error: "Internal server error" },
//     });
//   }
// };
// module.exports = graphControllers;

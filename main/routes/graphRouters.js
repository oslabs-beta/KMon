const express = require("express");
const router = express.Router();
const graphControllers = require("../controllers/graphControllers");

router.post("/graph", graphControllers.createGraph, (req, res) => {
  res.status(201).json({ graph_id: graphID });
});

router.get("/graph", graphControllers.getGraphs, (req, res) => {
  res.status(201).json({ graphs: result.rows });
});

module.exports = router;

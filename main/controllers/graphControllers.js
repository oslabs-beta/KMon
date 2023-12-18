const db = require('../models/db');

const graphControllers = {};

authControllers.createGraph = async (req, res, next) => {
    try{

    } catch(err) {
        return next({
            log: 'Error in graphControllers.createGraph',
            status: 500,
            message: { error: 'Internal server error' },
          });
    }
}
module.exports = graphControllers;


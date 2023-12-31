const { Pool } = require("pg");
const db = require("../../models/db");
const dbControllers = require("../dbControllers");
const { mockRes, mockReq, mockNext, mockPool } = require('../../__mocks__/express');


// mocking the db connections page to act as if the connection has been created
jest.mock('../../models/db', () => {
  return jest.fn().mockImplementation(() => {
    return {
      connect: jest.fn().mockResolvedValue('Connection created'),
    };
  });
});

describe('dbControllers', () => {

  it('should be an object', () => {

    expect(dbControllers).toBeInstanceOf(Object);
  });

  it('should have a saveConnection method', () => {

    expect(dbControllers.saveConnection).toBeInstanceOf(Function);
  });

  it('should have a getConnections method', () => {

    expect(dbControllers.getConnections).toBeInstanceOf(Function);
  });

  it('should have a deleteConnections method', () => {

    expect(dbControllers.deleteConnections).toBeInstanceOf(Function);
  });

})

describe('dbControllers.saveConnection', () => {

  let id, req, res;
  const next = mockNext;

  beforeEach(() => {
    id = 1 + Math.floor((Math.random() * 10));
    res = mockRes();
    req = mockReq();
    req.body.id = id;
    req.body.name = 'test';
    req.body.uri = '1.2.3.4';
    req.body.ports = ['1234', '2345', '3456'];
    req.body.created = '1/1/2001';
    req.body.userID = 10
    db.query = jest.fn();
  })

  afterAll(() => {
    jest.resetModules();
    jest.resetAllMocks();
  })

  // saveConnections --
  it('should make a query with the inputs from the request body', async () => {

    db.query.mockResolvedValue('query made');

    const { userID, name, uri, ports, created } = req.body;
    const portsJSON = JSON.stringify(ports);

    await dbControllers.saveConnection(req, res, next);

    expect(db.query.mock.calls[0][1]).toEqual([id, userID, name, uri, portsJSON, created]);
    expect(res.locals.response).toBe('query made')

  });

  it('should return an error if database returns an error', async () => {

    db.query.mockRejectedValue(new Error('Error in database'));

    const { userID, name, uri, ports, created } = req.body;
    const portsJSON = JSON.stringify(ports);

    await dbControllers.saveConnection(req, res, next);

    expect(db.query).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      log: 'Error occurred while saving connection to database',
      status: 500,
      message: "Couldn't save to database"
    }));
  });

});

describe('dbControllers.getConnections)', () => {

  let req, res, userid;
  const next = mockNext;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
    userid = 1 + Math.floor(Math.random() * 10)
    res = mockRes();
    req = mockReq();
    req.params.userid = userid;
    db.query = jest.fn();
  });

  afterAll(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });

  it('should query the database with the userid value', async () => {

    db.query.mockResolvedValue({ rows: ['database data'] });
    await dbControllers.getConnections(req, res, next);

    expect(db.query.mock.calls[0][1]).toEqual([userid]);
    expect(next).toHaveBeenCalledWith();
  })

  it('should save the returned data to res.locals', async () => {

    db.query.mockResolvedValue({ rows: ['database data'] });
    await dbControllers.getConnections(req, res, next);

    expect(res.locals.data).toEqual(['database data']);
  })

  it('should return an error if there is an issue in the database', async () => {

    db.query.mockRejectedValue(new Error('Error in database'));

    await dbControllers.getConnections(req, res, next);

    expect(res.locals.data).toBe(undefined);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      log: 'Error occurred while getting connections from database',
      status: 500,
      message: "Couldn't get from database"
    }));
  })
})

describe('dbControllers.deleteConnections', () => {

  let userid, clusters, req, res;
  const next = mockNext;

  const generateRandomClusterIds = () => {
    // create 5 random unique numbers between 1 and m.
    const ids = [];
    while (ids.length < 3) {
      const id = 1 + Math.floor((10 * Math.random()));
      if (!ids.includes(id)) {
        ids.push(id);
      }
    }
    return ids;
  };

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
    clusters = generateRandomClusterIds();
    userid = 1 + Math.floor(Math.random() * 10)
    req = mockReq();
    res = mockRes();
    req.body.userid = userid;
    req.body.clusters = clusters;
    db.query = jest.fn();
  });

  afterAll(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });

  it('should make a query that depends on the number of clusters', async () => {

    db.query.mockResolvedValue('rows deleted');

    await dbControllers.deleteConnections(req, res, next);

    expect(db.query.mock.calls[0][0]).toBe('DELETE FROM "Connections" WHERE (user_id=$1 AND cluster_id IN ($2, $3, $4))');
    expect(db.query.mock.calls[0][1]).toEqual([userid, ...clusters]);

  });

  it('should save the query response to res.locals', async () => {

    db.query.mockResolvedValue('rows deleted');

    await dbControllers.deleteConnections(req, res, next);

    expect(res.locals.dbResponse).toBe('rows deleted');
    expect(next).toHaveBeenCalledWith();

  });

  it('should return an error if there is an error from the databse query', async () => {

    db.query.mockRejectedValue(new Error('Error in database'));

    await dbControllers.deleteConnections(req, res, next);

    expect(res.locals.dbResponse).toBe(undefined);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      log: 'Error occurred while deleting connections from database',
      status: 500,
      message: "Couldn't delete from database"
    }));

  });
});



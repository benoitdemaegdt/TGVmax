import * as chai from 'chai';
import * as http from 'http';
import 'mocha';
import { ObjectId } from 'mongodb';
import * as request from 'supertest';
import App from '../src/app';
import Config from '../src/config';
import Database from '../src/database/database';
import { HttpStatus } from '../src/Enum';

describe('TravelAlertRouter', () => {
  /**
   * http server
   */
  let server: http.Server;

  /**
   * before running every test
   */
  before(async() => {
    server = App.listen(Config.port);

    return Promise.all([ Database.deleteAll('alerts'), Database.deleteAll('users') ]);
  });

  /**
   * after running every test
   */
  after(() => {
    server.close();
  });

  it('POST /api/v1/users/:userId/travels 201 CREATED', async() => {
    /**
     * A travelAlert is linked to a user
     * so I first need to insert a user in db and get its id
     */
    const res1: request.Response = await request(server)
    .post('/api/v1/users')
    .send({
      email: 'jane.doe@yopmail.com',
      password: 'this-is-my-fake-password',
      tgvmaxNumber: 'HC000054321',
    })
    .expect(HttpStatus.CREATED);

    const res2: request.Response = await request(server)
    .post(`/api/v1/users/${res1.body._id}/travels`)
    .send({
      origin: 'FRPAR',
      destination: 'FRLYS',
      fromTime: '2019-08-13T01:00:00.283185Z',
      toTime: '2019-08-13T13:00:00.283185Z',
    })
    .expect(HttpStatus.CREATED);

    chai.expect(res2.header).to.ownPropertyDescriptor('location');
    chai.expect(res2.body).to.ownPropertyDescriptor('_id');

    /**
     * check that travel alert is actually on db
     */
    interface t {origin: string; destination: string; status: string; }
    const insertedDoc: t[] = await Database.find<t>('alerts', {
      _id: new ObjectId(res2.body._id),
    });

    chai.expect(insertedDoc[0].origin).to.equal('FRPAR');
    chai.expect(insertedDoc[0].destination).to.equal('FRLYS');
    chai.expect(insertedDoc[0].status).to.equal('pending');
  });

  it('POST /api/v1/users/:userId/travels 404 NOT FOUND', async() => {
    /**
     * this is a random :userId
     */
    return request(server)
    .post('/api/v1/users/5d6824a20aa16d3a91ef8aa5/travels')
    .send({
      origin: 'FRPAR',
      destination: 'FRLYS',
      fromTime: '2019-09-13T01:00:00.283185Z',
      toTime: '2019-09-13T13:00:00.283185Z',
    })
    .expect(HttpStatus.NOT_FOUND)
    .expect((res: request.Response) => {
      chai.expect(res.body.statusCode).to.equal(HttpStatus.NOT_FOUND);
      chai.expect(res.body.message)
        .to.equal('user not found');
    });
  });

  it('POST /api/v1/users/:userId/travels 400 BAD REQUEST', async() => {
    return request(server)
    .post('/api/v1/users/userId2/travels')
    .send({
      origin: 'FRPAR',
      destination: 'FRLYS',
      fromTime: '2019-08-13T01:00:00.283185Z',
    })
    .expect(HttpStatus.BAD_REQUEST)
    .expect((res: request.Response) => {
      chai.expect(res.body.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      chai.expect(res.body.message).to.equal("should have required property 'toTime'");
    });
  });

  it('GET /api/v1/users/:userId/travels/:travelAlertId 200 OK', async() => {
    /**
     * A travelAlert is linked to a user
     * so I first need to insert a user in db and get its id
     */
    const res1: request.Response = await request(server)
    .post('/api/v1/users')
    .send({
      email: 'jack.doe@yopmail.com',
      password: 'this-is-my-fake-password',
      tgvmaxNumber: 'HC000054323',
    })
    .expect(HttpStatus.CREATED);

    /**
     * Add a travelAlert linked to this user
     */
    const res2: request.Response = await request(server)
    .post(`/api/v1/users/${res1.body._id}/travels`)
    .send({
      origin: 'FRPAR',
      destination: 'FRLYS',
      fromTime: '2019-08-13T01:00:00.283185Z',
      toTime: '2019-08-13T13:00:00.283185Z',
    })
    .expect(HttpStatus.CREATED);

    /**
     * test route GET
     */
    const res3: request.Response = await request(server)
    .get(`/api/v1/users/${res1.body._id}/travels/${res2.body._id}`)
    .expect(HttpStatus.OK);

    chai.expect(res3.body[0].origin).to.equal('FRPAR');
    chai.expect(res3.body[0].destination).to.equal('FRLYS');
    chai.expect(res3.body[0].status).to.equal('pending');
  });

  it('GET /api/v1/users/:userId/travels/:travelAlertId 404 NOT FOUND', async() => {
    /**
     * test route GET with random userId and travelAlertId uuid
     */
    const res: request.Response = await request(server)
    .get('/api/v1/users/5d6ad4a0ffdc444360854134/travels/5d6ad4a0ffdc444360854135')
    .expect(HttpStatus.NOT_FOUND);

    chai.expect(res.body).to.deep.equal([]);
  });

  it('GET /api/v1/users/:userId/travels 200 OK', async() => {
    /**
     * A travelAlert is linked to a user
     * so I first need to insert a user in db and get its id
     */
    const res1: request.Response = await request(server)
    .post('/api/v1/users')
    .send({
      email: 'jeff.doe@yopmail.com',
      password: 'this-is-my-fake-password',
      tgvmaxNumber: 'HC000054324',
    })
    .expect(HttpStatus.CREATED);

    /**
     * Add a travelAlert linked to this user
     */
    const res2: request.Response = await request(server)
    .post(`/api/v1/users/${res1.body._id}/travels`)
    .send({
      origin: 'FRPAR',
      destination: 'FRLYS',
      fromTime: '2019-08-13T01:00:00.283185Z',
      toTime: '2019-08-13T13:00:00.283185Z',
    })
    .expect(HttpStatus.CREATED);

    const res3: request.Response = await request(server)
    .post(`/api/v1/users/${res1.body._id}/travels`)
    .send({
      origin: 'FRPAR',
      destination: 'FRNIT',
      fromTime: '2019-08-13T01:00:00.283185Z',
      toTime: '2019-08-13T13:00:00.283185Z',
    })
    .expect(HttpStatus.CREATED);

    /**
     * test route GET
     */
    const res4: request.Response = await request(server)
    .get(`/api/v1/users/${res1.body._id}/travels`)
    .expect(HttpStatus.OK);

    chai.expect(res4.body[0]._id).to.equal(res2.body._id);
    chai.expect(res4.body[1]._id).to.equal(res3.body._id);
  });

  it('GET /api/v1/users/:userId/travels 404 NOT FOUND', async() => {
    /**
     * test route GET with random userId uuid
     */
    const res: request.Response = await request(server)
    .get('/api/v1/users/5d6ad4a0ffdc444360854139/travels')
    .expect(HttpStatus.NOT_FOUND);

    chai.expect(res.body).to.deep.equal([]);
  });

  it('DELETE /api/v1/users/:userId/travels/:travelAlertId 200 OK', async() => {
    /**
     * A travelAlert is linked to a user
     * so I first need to insert a user in db and get its id
     */
    const res1: request.Response = await request(server)
    .post('/api/v1/users')
    .send({
      email: 'joey.doe@yopmail.com',
      password: 'this-is-my-fake-password',
      tgvmaxNumber: 'HC000054325',
    })
    .expect(HttpStatus.CREATED);

    /**
     * Add a travelAlert linked to this user
     */
    const res2: request.Response = await request(server)
    .post(`/api/v1/users/${res1.body._id}/travels`)
    .send({
      origin: 'FRPSL',
      destination: 'FRLYS',
      fromTime: '2019-08-13T01:00:00.283185Z',
      toTime: '2019-08-13T13:00:00.283185Z',
    })
    .expect(HttpStatus.CREATED);

    /**
     * check that doc is actually in dd
     */
    const doc1: {origin: string}[] = await Database.find<{origin: string}>('alerts', {
      _id: new ObjectId(res2.body._id),
    });

    chai.expect(doc1[0].origin).to.equal('FRPSL');

    await request(server)
    .delete(`/api/v1/users/${res1.body._id}/travels/${res2.body._id}`)
    .expect(HttpStatus.OK);

    /**
     * check that doc does not exists anymore in dd
     */
    const doc2: object[] = await Database.find<object>('alerts', {
      _id: new ObjectId(res2.body._id),
    });

    chai.expect(doc2).to.deep.equal([]);
  });
});

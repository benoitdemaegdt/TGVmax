import * as chai from 'chai';
import * as http from 'http';
import 'mocha';
import * as moment from 'moment-timezone';
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
  before(async () => {
    server = App.listen(Config.port);

    return Promise.all([Database.deleteAll('alerts'), Database.deleteAll('users')]);
  });

  /**
   * after running every test
   */
  after(async () => {
    server.close();
  });

  it('POST /api/v1/users/:userId/travels 201 CREATED', async () => {
    /**
     * A travelAlert is linked to a user
     * so I first need to insert a user in db and get its id
     */
    const res1: request.Response = await request(server)
      .post('/api/v1/users?action=register')
      .send({
        email: 'jane.doe@gmail.com',
        password: 'this-is-my-fake-password',
        tgvmaxNumber: 'HC000054321',
      })
      .expect(HttpStatus.CREATED);

    const res2: request.Response = await request(server)
      .post(`/api/v1/users/${res1.body._id}/travels`)
      .set({ Authorization: `Bearer ${res1.body.token}` })
      .send({
        origin: { name: 'Paris (toutes gares intramuros)', sncfId: 'FRPAR', trainlineId: '1' },
        destination: { name: 'Lyon (toutes gares intramuros)', sncfId: 'FRLYS', trainlineId: '2' },
        fromTime: '2019-08-13T01:00:00.283185Z',
        toTime: '2019-08-13T13:00:00.283185Z',
      })
      .expect(HttpStatus.CREATED);

    chai.expect(res2.header).to.ownPropertyDescriptor('location');
    chai.expect(res2.body).to.ownPropertyDescriptor('_id');

    /**
     * check that travel alert is actually on db
     */
    interface t { origin: string; destination: string; status: string; tgvmaxNumber: string; }
    const insertedDoc: t[] = await Database.find<t>('alerts', {
      _id: new ObjectId(res2.body._id),
    });

    chai.expect(insertedDoc[0].origin).to.deep.equal({ name: 'Paris (toutes gares intramuros)', sncfId: 'FRPAR', trainlineId: '1' });
    chai.expect(insertedDoc[0].destination).to.deep.equal({ name: 'Lyon (toutes gares intramuros)', sncfId: 'FRLYS', trainlineId: '2' });
    chai.expect(insertedDoc[0].status).to.equal('pending');
    chai.expect(insertedDoc[0].tgvmaxNumber).to.equal('HC000054321');
  });

  it('POST /api/v1/users/:userId/travels 404 NOT FOUND', async () => {
    const res1: request.Response = await request(server)
      .post('/api/v1/users?action=register')
      .send({
        email: 'johan.doe@gmail.com',
        password: 'this-is-my-fake-password',
        tgvmaxNumber: 'HC000054322',
      })
      .expect(HttpStatus.CREATED);

    /**
     * this is a random :userId
     */
    return request(server)
      .post('/api/v1/users/5d6824a20aa16d3a91ef8aa5/travels')
      .set({ Authorization: `Bearer ${res1.body.token}` })
      .send({
        origin: { name: 'Paris (toutes gares intramuros)', sncfId: 'FRPAR', trainlineId: '1' },
        destination: { name: 'Lyon (toutes gares intramuros)', sncfId: 'FRLYS', trainlineId: '1' },
        fromTime: '2019-09-13T01:00:00.283185Z',
        toTime: '2019-09-13T13:00:00.283185Z',
      })
      .expect(HttpStatus.NOT_FOUND)
      .expect((res: request.Response) => {
        chai.expect(res.body.statusCode).to.equal(HttpStatus.NOT_FOUND);
        chai.expect(res.body.message).to.equal('user not found');
      });
  });

  it('POST /api/v1/users/:userId/travels 400 BAD REQUEST (missing  property)', async () => {
    const res1: request.Response = await request(server)
      .post('/api/v1/users?action=register')
      .send({
        email: 'johana.doe@gmail.com',
        password: 'this-is-my-fake-password',
        tgvmaxNumber: 'HC000054323',
      })
      .expect(HttpStatus.CREATED);

    return request(server)
      .post('/api/v1/users/userId2/travels')
      .set({ Authorization: `Bearer ${res1.body.token}` })
      .send({
        origin: { name: 'Paris (toutes gares intramuros)', sncfId: 'FRPAR', trainlineId: '1' },
        destination: { name: 'Lyon (toutes gares intramuros)', sncfId: 'FRLYS', trainlineId: '2' },
        fromTime: '2019-08-13T01:00:00.283185Z',
      })
      .expect(HttpStatus.BAD_REQUEST)
      .expect((res: request.Response) => {
        chai.expect(res.body.statusCode).to.equal(HttpStatus.BAD_REQUEST);
        chai.expect(res.body.message).to.equal("should have required property 'toTime'");
      });
  });

  it('POST /api/v1/users/:userId/travels 400 BAD REQUEST (alert already exists)', async () => {
    /**
     * A travelAlert is linked to a user
     * so I first need to insert a user in db and get its id
     */
    const res1: request.Response = await request(server)
      .post('/api/v1/users?action=register')
      .send({
        email: 'bane.doe@gmail.com',
        password: 'this-is-my-fake-password',
        tgvmaxNumber: 'HC000076543',
      })
      .expect(HttpStatus.CREATED);

    await request(server)
      .post(`/api/v1/users/${res1.body._id}/travels`)
      .set({ Authorization: `Bearer ${res1.body.token}` })
      .send({
        origin: { name: 'Paris (toutes gares intramuros)', sncfId: 'FRPAR', trainlineId: '1' },
        destination: { name: 'Lyon (toutes gares intramuros)', sncfId: 'FRLYS', trainlineId: '2' },
        fromTime: moment(new Date()).add(1, 'days').startOf('day').toISOString(),
        toTime: moment(new Date()).add(1, 'days').endOf('day').toISOString(),
      })
      .expect(HttpStatus.CREATED);

    return request(server)
      .post(`/api/v1/users/${res1.body._id}/travels`)
      .set({ Authorization: `Bearer ${res1.body.token}` })
      .send({
        origin: { name: 'Paris (toutes gares intramuros)', sncfId: 'FRPAR', trainlineId: '1' },
        destination: { name: 'Lyon (toutes gares intramuros)', sncfId: 'FRLYS', trainlineId: '2' },
        fromTime: moment(new Date()).add(1, 'days').startOf('day').toISOString(),
        toTime: moment(new Date()).add(1, 'days').endOf('day').toISOString(),
      })
      .expect(HttpStatus.UNPROCESSABLE_ENTITY)
      .expect((res: request.Response) => {
        chai.expect(res.body.statusCode).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);
        chai.expect(res.body.message).to.equal('Une alerte similaire existe déjà');
      });
  });

  it('GET /api/v1/users/:userId/travels/:travelAlertId 200 OK', async () => {
    /**
     * A travelAlert is linked to a user
     * so I first need to insert a user in db and get its id
     */
    const res1: request.Response = await request(server)
      .post('/api/v1/users?action=register')
      .send({
        email: 'jack.doe@gmail.com',
        password: 'this-is-my-fake-password',
        tgvmaxNumber: 'HC000054329',
      })
      .expect(HttpStatus.CREATED);

    /**
     * Add a travelAlert linked to this user
     */
    const res2: request.Response = await request(server)
      .post(`/api/v1/users/${res1.body._id}/travels`)
      .set({ Authorization: `Bearer ${res1.body.token}` })
      .send({
        origin: { name: 'Paris (toutes gares intramuros)', sncfId: 'FRPAR', trainlineId: '1' },
        destination: { name: 'Lyon (toutes gares intramuros)', sncfId: 'FRLYS', trainlineId: '2' },
        fromTime: '2019-08-13T01:00:00.283185Z',
        toTime: '2019-08-13T13:00:00.283185Z',
      })
      .expect(HttpStatus.CREATED);

    /**
     * test route GET
     */
    const res3: request.Response = await request(server)
      .get(`/api/v1/users/${res1.body._id}/travels/${res2.body._id}`)
      .set({ Authorization: `Bearer ${res1.body.token}` })
      .expect(HttpStatus.OK);

    chai.expect(res3.body[0].origin).to.deep.equal({ name: 'Paris (toutes gares intramuros)', sncfId: 'FRPAR', trainlineId: '1' });
    chai.expect(res3.body[0].destination).to.deep.equal({ name: 'Lyon (toutes gares intramuros)', sncfId: 'FRLYS', trainlineId: '2' });
    chai.expect(res3.body[0].status).to.equal('pending');
    chai.expect(res3.body[0].tgvmaxNumber).to.equal('HC000054329');
  });

  it('GET /api/v1/users/:userId/travels/:travelAlertId 404 NOT FOUND', async () => {
    const res1: request.Response = await request(server)
      .post('/api/v1/users?action=register')
      .send({
        email: 'janone.doe@gmail.com',
        password: 'this-is-my-fake-password',
        tgvmaxNumber: 'HC000054328',
      })
      .expect(HttpStatus.CREATED);

    /**
     * test route GET with random userId and travelAlertId uuid
     */
    const res: request.Response = await request(server)
      .get('/api/v1/users/5d6ad4a0ffdc444360854134/travels/5d6ad4a0ffdc444360854135')
      .set({ Authorization: `Bearer ${res1.body.token}` })
      .expect(HttpStatus.NOT_FOUND);

    chai.expect(res.body).to.deep.equal([]);
  });

  it('GET /api/v1/users/:userId/travels 200 OK', async () => {
    /**
     * A travelAlert is linked to a user
     * so I first need to insert a user in db and get its id
     */
    const res1: request.Response = await request(server)
      .post('/api/v1/users?action=register')
      .send({
        email: 'jeff.doe@gmail.com',
        password: 'this-is-my-fake-password',
        tgvmaxNumber: 'HC000054324',
      })
      .expect(HttpStatus.CREATED);

    /**
     * Add a travelAlert linked to this user
     */
    const date: Date = new Date();
    const res2: request.Response = await request(server)
      .post(`/api/v1/users/${res1.body._id}/travels`)
      .set({ Authorization: `Bearer ${res1.body.token}` })
      .send({
        origin: { name: 'Paris (toutes gares intramuros)', sncfId: 'FRPAR', trainlineId: '1' },
        destination: { name: 'Lyon (toutes gares intramuros)', sncfId: 'FRLYS', trainlineId: '2' },
        fromTime: new Date(date.setDate(date.getDate() + 1)).toISOString(),
        toTime: new Date(date.setDate(date.getDate() + 1)).toISOString(),
      })
      .expect(HttpStatus.CREATED);

    const res3: request.Response = await request(server)
      .post(`/api/v1/users/${res1.body._id}/travels`)
      .set({ Authorization: `Bearer ${res1.body.token}` })
      .send({
        origin: { name: 'Paris (toutes gares intramuros)', sncfId: 'FRPAR', trainlineId: '1' },
        destination: { name: 'Niort', sncfId: 'FRNIT', trainlineId: '2' },
        fromTime: new Date(date.setDate(date.getDate() + 2)).toISOString(),
        toTime: new Date(date.setDate(date.getDate() + 2)).toISOString(),
      })
      .expect(HttpStatus.CREATED);

    /**
     * test route GET
     */
    const res4: request.Response = await request(server)
      .get(`/api/v1/users/${res1.body._id}/travels`)
      .set({ Authorization: `Bearer ${res1.body.token}` })
      .expect(HttpStatus.OK);

    chai.expect(res4.body[0]._id).to.equal(res2.body._id);
    chai.expect(res4.body[1]._id).to.equal(res3.body._id);
  });

  it('GET /api/v1/users/:userId/travels 401 UNAUTHORIEZD', async () => {
    const res1: request.Response = await request(server)
      .post('/api/v1/users?action=register')
      .send({
        email: 'ben.doe@gmail.com',
        password: 'this-is-my-fake-password',
        tgvmaxNumber: 'HC000054327',
      })
      .expect(HttpStatus.CREATED);

    /**
     * Add a travelAlert linked to this user
     */
    await request(server)
      .post(`/api/v1/users/${res1.body._id}/travels`)
      .set({ Authorization: 'Bearer this-is-a-fake-jwt' })
      .send({
        origin: { name: 'Paris (toutes gares intramuros)', sncfId: 'FRPAR', trainlineId: '1' },
        destination: { name: 'Lyon (toutes gares intramuros)', sncfId: 'FRLYS', trainlineId: '2' },
        fromTime: '2019-08-13T01:00:00.283185Z',
        toTime: '2019-08-13T13:00:00.283185Z',
      })
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('DELETE /api/v1/users/:userId/travels/:travelAlertId 200 OK', async () => {
    /**
     * A travelAlert is linked to a user
     * so I first need to insert a user in db and get its id
     */
    const res1: request.Response = await request(server)
      .post('/api/v1/users?action=register')
      .send({
        email: 'joey.doe@gmail.com',
        password: 'this-is-my-fake-password',
        tgvmaxNumber: 'HC000054325',
      })
      .expect(HttpStatus.CREATED);

    /**
     * Add a travelAlert linked to this user
     */
    const res2: request.Response = await request(server)
      .post(`/api/v1/users/${res1.body._id}/travels`)
      .set({ Authorization: `Bearer ${res1.body.token}` })
      .send({
        origin: { name: 'Paris (toutes gares intramuros)', sncfId: 'FRPAR', trainlineId: '1' },
        destination: { name: 'Lyon (toutes gares intramuros)', sncfId: 'FRLYS', trainlineId: '2' },
        fromTime: '2019-08-13T01:00:00.283185Z',
        toTime: '2019-08-13T13:00:00.283185Z',
      })
      .expect(HttpStatus.CREATED);

    /**
     * check that doc is actually in dd
     */
    const doc1: { origin: string }[] = await Database.find<{ origin: string }>('alerts', {
      _id: new ObjectId(res2.body._id),
    });

    chai.expect(doc1[0].origin).to.deep.equal({ name: 'Paris (toutes gares intramuros)', sncfId: 'FRPAR', trainlineId: '1' });

    await request(server)
      .delete(`/api/v1/users/${res1.body._id}/travels/${res2.body._id}`)
      .set({ Authorization: `Bearer ${res1.body.token}` })
      .expect(HttpStatus.OK);

    /**
     * check that doc does not exists anymore in dd
     */
    const doc2: object[] = await Database.find<object>('alerts', {
      _id: new ObjectId(res2.body._id),
    });

    chai.expect(doc2).to.deep.equal([]);
  });

  it('POST /api/v1/users/:userId/travels 422 UNPROCESSABLE ENTITY', async () => {
    /**
     * A travelAlert is linked to a user
     * so I first need to insert a user in db and get its id
     */
    const res1: request.Response = await request(server)
      .post('/api/v1/users?action=register')
      .send({
        email: 'tom.doe@gmail.com',
        password: 'this-is-my-fake-password',
        tgvmaxNumber: 'HC000065432',
      })
      .expect(HttpStatus.CREATED);

    /**
     * insert a first travel alert
     */
    await request(server)
      .post(`/api/v1/users/${res1.body._id}/travels`)
      .set({ Authorization: `Bearer ${res1.body.token}` })
      .send({
        origin: { name: 'Paris (toutes gares intramuros)', sncfId: 'FRPAR', trainlineId: '1' },
        destination: { name: 'Lyon (toutes gares intramuros)', sncfId: 'FRLYS', trainlineId: '2' },
        fromTime: moment(new Date()).add(1, 'days').startOf('day').toISOString(),
        toTime: moment(new Date()).add(1, 'days').endOf('day').toISOString(),
      })
      .expect(HttpStatus.CREATED);

    /**
     * insert a second travel alert
     */
    await request(server)
      .post(`/api/v1/users/${res1.body._id}/travels`)
      .set({ Authorization: `Bearer ${res1.body.token}` })
      .send({
        origin: { name: 'Paris (toutes gares intramuros)', sncfId: 'FRPAR', trainlineId: '1' },
        destination: { name: 'Lyon (toutes gares intramuros)', sncfId: 'FRLYS', trainlineId: '2' },
        fromTime: moment(new Date()).add(2, 'days').startOf('day').toISOString(),
        toTime: moment(new Date()).add(2, 'days').endOf('day').toISOString(),
      })
      .expect(HttpStatus.CREATED);

    /**
     * insert a third travel alert - should fail
     */
    return request(server)
      .post(`/api/v1/users/${res1.body._id}/travels`)
      .set({ Authorization: `Bearer ${res1.body.token}` })
      .send({
        origin: { name: 'Paris (toutes gares intramuros)', sncfId: 'FRPAR', trainlineId: '1' },
        destination: { name: 'Lyon (toutes gares intramuros)', sncfId: 'FRLYS', trainlineId: '2' },
        fromTime: moment(new Date()).add(3, 'days').startOf('day').toISOString(),
        toTime: moment(new Date()).add(3, 'days').endOf('day').toISOString(),
      })
      .expect(HttpStatus.UNPROCESSABLE_ENTITY)
      .expect((res: request.Response) => {
        chai.expect(res.body.message).to.equal(`Limite atteinte : ${Config.maxAlertsPerUser} alertes en cours`);
      });
  });
});

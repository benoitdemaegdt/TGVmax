import * as chai from 'chai';
import * as http from 'http';
import 'mocha';
import * as request from 'supertest';
import App from '../src/app';
import Config from '../src/config';
import Database from '../src/database/db';
import { HttpStatus } from '../src/Enum';

describe('UserRouter', () => {
  /**
   * http server
   */
  let server: http.Server;

  /**
   * before running every test
   */
  before(async() => {
    server = App.listen(Config.port);

    return Promise.all([ Database.clear('travel_alerts'), Database.clear('users') ]);
  });

  /**
   * after running every test
   */
  after(() => {
    server.close();
  });

  it('POST /api/v1/users/ 201 CREATED', async() => {
    const response: request.Response = await request(server)
    .post('/api/v1/users')
    .send({
      email: 'jane.doe@yopmail.com',
      password: 'this-is-my-fake-password',
      tgvmaxNumber: 'HC000054321',
    })
    .expect(HttpStatus.CREATED);

    chai.expect(response.header).to.ownPropertyDescriptor('location');
    chai.expect(response.body).to.ownPropertyDescriptor('id');

    const insertedDoc: {tgvmaxNumber: string}[] = await Database.find<{tgvmaxNumber: string}>('users', {
      id: response.body.id,
    });

    chai.expect(insertedDoc[0].tgvmaxNumber).to.equal('HC000054321');
  });

  it('POST /api/v1/users/ 400 BAD REQUEST (missing property)', async() => {
    return request(server)
    .post('/api/v1/users')
    .send({
      email: 'jane.doe@yopmail.com',
      password: 'this-is-my-fake-password',
    })
    .expect(HttpStatus.BAD_REQUEST)
    .then((response: request.Response) => {
      chai.expect(response.body.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      chai.expect(response.body.detail).to.equal('should have required property \'tgvmaxNumber\'');
    });
  });

  it('POST /api/v1/users/ 400 BAD REQUEST (invalid format)', async() => {
    return request(server)
    .post('/api/v1/users')
    .send({
      email: 'jane.doe@yopmail.com',
      password: 'this-is-my-fake-password',
      tgvmaxNumber: 'HC0000',
    })
    .expect(HttpStatus.BAD_REQUEST)
    .then((response: request.Response) => {
      chai.expect(response.body.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      chai.expect(response.body.detail).to.equal('should NOT be shorter than 11 characters');
    });
  });

  it('POST /api/v1/users/ 422 UNPROCESSABLE ENTITY', async() => {
    return request(server)
    .post('/api/v1/users')
    .send({
      email: 'jane.doe@yopmail.com',
      password: 'this-is-my-fake-password',
      tgvmaxNumber: 'HC000054321',
    })
    .expect(HttpStatus.UNPROCESSABLE_ENTITY)
    .then((response: request.Response) => {
      chai.expect(response.body.statusCode).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);
      chai.expect(response.body.detail).to.equal('Key (email)=(jane.doe@yopmail.com) already exists.');
    });
  });

  it('DELETE /api/v1/users/:userId 200 OK', async() => {
    const insertedDoc: request.Response = await request(server)
    .post('/api/v1/users')
    .send({
      email: 'john.doe@yopmail.com',
      password: 'this-is-my-fake-password',
      tgvmaxNumber: 'HC000054322',
    })
    .expect(HttpStatus.CREATED);

    await request(server)
    .delete(`/api/v1/users/${insertedDoc.body.id}`)
    .expect(HttpStatus.OK);

    /**
     * check that doc does not exists anymore in dd
     */
    const doc: {tgvmaxNumber: string}[] = await Database.find<{tgvmaxNumber: string}>('users', {
      id: insertedDoc.body.id,
    });

    chai.expect(doc).to.deep.equal([]);
  });
});

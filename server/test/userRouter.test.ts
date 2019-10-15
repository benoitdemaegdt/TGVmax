import * as chai from 'chai';
import * as http from 'http';
import 'mocha';
import { ObjectId } from 'mongodb';
import * as request from 'supertest';
import App from '../src/app';
import Config from '../src/config';
import Database from '../src/database/database';
import { HttpStatus } from '../src/Enum';
import { IUser } from '../src/types';

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

    return Promise.all([ Database.deleteAll('users'), Database.deleteAll('alerts') ]);
  });

  /**
   * after running every test
   */
  after(async() => {
    await Database.disconnect();
    server.close();
  });

  it('POST /api/v1/users/?action=register 201 CREATED', async() => {
    const response: request.Response = await request(server)
    .post('/api/v1/users?action=register')
    .send({
      email: 'jane.doe@gmail.com',
      password: 'this-is-my-fake-password',
      tgvmaxNumber: 'HC000054321',
    })
    .expect(HttpStatus.CREATED);

    chai.expect(response.header).to.ownPropertyDescriptor('location');
    chai.expect(response.body).to.ownPropertyDescriptor('_id');
    chai.expect(response.body).to.ownPropertyDescriptor('token');

    const insertedDoc: IUser[] = await Database.find<IUser>('users', {
      _id: new ObjectId(response.body._id),
    });

    if (insertedDoc.length === 0) {
      throw new Error('insertedDoc should not be null');
    } else {
      chai.expect(insertedDoc[0].tgvmaxNumber).to.equal('HC000054321');
      chai.expect(insertedDoc[0].email).to.equal('jane.doe@gmail.com');
    }
  });

  it('POST /api/v1/users/?action=login 200 OK', async() => {
    const response: request.Response = await request(server)
    .post('/api/v1/users?action=login')
    .send({
      email: 'jane.doe@gmail.com',
      password: 'this-is-my-fake-password',
    })
    .expect(HttpStatus.OK);

    chai.expect(response.header).to.ownPropertyDescriptor('location');
    chai.expect(response.body).to.ownPropertyDescriptor('_id');
    chai.expect(response.body).to.ownPropertyDescriptor('token');
  });

  it('POST /api/v1/users/?action=login 401 UNAUTHORIZED', async() => {
    await request(server)
    .post('/api/v1/users?action=login')
    .send({
      email: 'jane.doe@gmail.com',
      password: 'wrong-password',
    })
    .expect(HttpStatus.UNAUTHORIZED)
    .then((response: request.Response) => {
      chai.expect(response.body.statusCode).to.equal(HttpStatus.UNAUTHORIZED);
      chai.expect(response.body.message).to.equal('email / mot de passe invalide');
    });
  });

  it('POST /api/v1/users/ 400 BAD REQUEST (missing property)', async() => {
    return request(server)
    .post('/api/v1/users?action=register')
    .send({
      email: 'jane.doe@gmail.com',
      password: 'this-is-my-fake-password',
    })
    .expect(HttpStatus.BAD_REQUEST)
    .then((response: request.Response) => {
      chai.expect(response.body.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      chai.expect(response.body.message).to.equal('should have required property \'tgvmaxNumber\'');
    });
  });

  it('POST /api/v1/users/ 400 BAD REQUEST (invalid format)', async() => {
    return request(server)
    .post('/api/v1/users?action=register')
    .send({
      email: 'jane.doe@gmail.com',
      password: 'this-is-my-fake-password',
      tgvmaxNumber: 'HC0000',
    })
    .expect(HttpStatus.BAD_REQUEST)
    .then((response: request.Response) => {
      chai.expect(response.body.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      chai.expect(response.body.message).to.equal('should NOT be shorter than 11 characters');
    });
  });

  it('POST /api/v1/users/ 400 BAD REQUEST (invalid pattern)', async() => {
    return request(server)
    .post('/api/v1/users?action=register')
    .send({
      email: 'jane.doe@gmail.com',
      password: 'this-is-my-fake-password',
      tgvmaxNumber: 'AB000054321',
    })
    .expect(HttpStatus.BAD_REQUEST)
    .then((response: request.Response) => {
      chai.expect(response.body.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      chai.expect(response.body.message).to.equal('should match pattern "^HC"');
    });
  });

  it('POST /api/v1/users/ 400 BAD REQUEST (yopmail)', async() => {
    return request(server)
    .post('/api/v1/users?action=register')
    .send({
      email: 'jane.doe@yopmail.com',
      password: 'this-is-my-fake-password',
      tgvmaxNumber: 'HC000054321',
    })
    .expect(HttpStatus.BAD_REQUEST)
    .then((response: request.Response) => {
      chai.expect(response.body.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      chai.expect(response.body.message).to.equal('should NOT be valid');
    });
  });

  it('POST /api/v1/users/ 422 UNPROCESSABLE ENTITY', async() => {
    return request(server)
    .post('/api/v1/users?action=register')
    .send({
      email: 'jane.doe@gmail.com',
      password: 'this-is-my-fake-password',
      tgvmaxNumber: 'HC000064321',
    })
    .expect(HttpStatus.UNPROCESSABLE_ENTITY)
    .then((response: request.Response) => {

      chai.expect(response.body.statusCode).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);
      chai.expect(response.body.message).to.equal('Cet email est déjà utilisé');
    });
  });

  it('GET /api/v1/users/:userId 200 OK', async() => {
    const response: request.Response = await request(server)
    .post('/api/v1/users?action=login')
    .send({
      email: 'jane.doe@gmail.com',
      password: 'this-is-my-fake-password',
    })
    .expect(HttpStatus.OK);

    const responseUser: request.Response = await request(server)
    .get(`/api/v1/users/${response.body._id}`)
    .set({ Authorization: `Bearer ${response.body.token}` })
    .expect(HttpStatus.OK);

    chai.expect(responseUser.body.email).to.equal('jane.doe@gmail.com');
    chai.expect(responseUser.body.tgvmaxNumber).to.equal('HC000054321');
  });

  it('GET /api/v1/users/:userId 401 UNAUTHORIZED', async() => {
    return request(server)
    .get('/api/v1/users/5d9b87920f8408d241a50012') // fakeId
    .expect(HttpStatus.UNAUTHORIZED);
  });

  it('GET /api/v1/users/:userId 404 NOT FOUND', async() => {
    const response: request.Response = await request(server)
    .post('/api/v1/users?action=login')
    .send({
      email: 'jane.doe@gmail.com',
      password: 'this-is-my-fake-password',
    })
    .expect(HttpStatus.OK);

    return request(server)
    .get('/api/v1/users/5d9b87920f8408d241a50012') // fakeId
    .set({ Authorization: `Bearer ${response.body.token}` })
    .expect(HttpStatus.NOT_FOUND);
  });

  it('DELETE /api/v1/users/:userId 200 OK', async() => {
    const insertedDoc: request.Response = await request(server)
    .post('/api/v1/users?action=register')
    .send({
      email: 'john.doe@gmail.com',
      password: 'this-is-my-fake-password',
      tgvmaxNumber: 'HC000054322',
    })
    .expect(HttpStatus.CREATED);

    await request(server)
    .delete(`/api/v1/users/${insertedDoc.body._id}`)
    .set({ Authorization: `Bearer ${insertedDoc.body.token}` })
    .expect(HttpStatus.OK);

    /**
     * check that doc does not exists anymore in dd
     */
    const doc: {tgvmaxNumber: string}[] = await Database.find<{tgvmaxNumber: string}>('users', {
      _id: new ObjectId(insertedDoc.body._id),
    });

    chai.expect(doc).to.deep.equal([]);
  });
});

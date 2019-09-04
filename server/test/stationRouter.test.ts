import * as chai from 'chai';
import * as http from 'http';
import 'mocha';
import * as request from 'supertest';
import App from '../src/app';
import Config from '../src/config';
import Database from '../src/database/database';
import { HttpStatus } from '../src/Enum';

describe('StationRouter', () => {
  /**
   * http server
   */
  let server: http.Server;

  /**
   * before running every test
   */
  before(async() => {
    server = App.listen(Config.port);
    await Promise.all([ Database.deleteAll('alerts'), Database.deleteAll('users'), Database.deleteAll('stations') ]);

    return Promise.all([
      Database.insertOne('stations', {name: 'Paris (toutes gares intramuros)', code: 'FRPAR' }),
      Database.insertOne('stations', {name: 'Lyon (toutes gares intramuros)', code: 'FRLYS' }),
      Database.insertOne('stations', {name: 'Marseille (toutes gares)', code: 'FRMRS' }),
    ]);
  });

  /**
   * after running every test
   */
  after(async() => {
    await Database.disconnect();
    server.close();
  });

  it('GET /api/v1/stations 200 OK', async() => {
    /**
     * insert a user for auth purpose
     */
    const res1: request.Response = await request(server)
    .post('/api/v1/users?action=register')
    .send({
      email: 'jane.doe@yopmail.com',
      password: 'this-is-my-fake-password',
      tgvmaxNumber: 'HC000054321',
    })
    .expect(HttpStatus.CREATED);

    const res2: request.Response = await request(server)
    .get('/api/v1/stations')
    .set({ Authorization: `Bearer ${res1.body.token}` })
    .expect(HttpStatus.OK);

    chai.expect(res2.body.includes('Paris (toutes gares intramuros)')).to.equal(true);
    chai.expect(res2.body.includes('Lyon (toutes gares intramuros)')).to.equal(true);
    chai.expect(res2.body.includes('Marseille (toutes gares)')).to.equal(true);
  });

  it('GET /api/v1/stations 401 UNAUTHORIZED', async() => {
    return request(server)
    .get('/api/v1/stations')
    .expect(HttpStatus.UNAUTHORIZED);
  });
});

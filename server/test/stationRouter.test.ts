import * as chai from 'chai';
import * as http from 'http';
import 'mocha';
import * as request from 'supertest';
import App from '../src/app';
import Config from '../src/config';
import Database from '../src/database/database';
import { HttpStatus } from '../src/Enum';
import { IStation } from '../src/types';

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
      Database.insertOne('stations', {name: 'Gare Montparnasse (Paris)', sncfId: 'FRPMO', trainlineId: '4920' }),
      Database.insertOne('stations', {name: 'Lyon Part-Dieu', sncfId: 'FRLPD', trainlineId: '4676' }),
      Database.insertOne('stations', {name: 'Marseille Saint-Charles', sncfId: 'FRMSC', trainlineId: '4791' }),
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

    chai.expect(res2.body.length).to.equal(3);

    const names: string[] = res2.body.map((station: IStation) => {
      return station.name;
    });

    chai.expect(names.includes('Lyon Part-Dieu')).to.equal(true);
    chai.expect(names.includes('Marseille Saint-Charles')).to.equal(true);
    chai.expect(names.includes('Gare Montparnasse (Paris)')).to.equal(true);

    const sncfIds: string[] = res2.body.map((station: IStation) => {
      return station.sncfId;
    });

    chai.expect(sncfIds.includes('FRPMO')).to.equal(true);
    chai.expect(sncfIds.includes('FRLPD')).to.equal(true);
    chai.expect(sncfIds.includes('FRMSC')).to.equal(true);
  });

  it('GET /api/v1/stations 401 UNAUTHORIZED', async() => {
    return request(server)
    .get('/api/v1/stations')
    .expect(HttpStatus.UNAUTHORIZED);
  });
});

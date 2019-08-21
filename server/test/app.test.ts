import * as http from 'http';
import { isNil } from 'lodash';
import 'mocha';
import * as request from 'supertest';
import App from '../src/app';
import Config from '../src/config';
import { HttpStatus } from '../src/Enum';

describe('App', () => {

  let server: http.Server;

  /**
   * before running every test
   */
  before(() => {
    server = App.listen(Config.port);
  });

  /**
   * after running every test
   */
  after(() => {
    server.close();
  });

  it('should GET / 200 OK', async() => {
    request(server)
    .get('/')
    .expect(HttpStatus.OK)
    .end((err: Error, _res: request.Response) => {
      if (!isNil(err)) {
        throw err;
      }
    });
  });

  it('should POST / 405 METHOD NOT ALLOWED', async() => {
    request(server)
    .post('/')
    .expect(HttpStatus.METHOD_NOT_ALLOWED)
    .end((err: Error, _res: request.Response) => {
      if (!isNil(err)) {
        throw err;
      }
    });
  });
});

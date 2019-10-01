import 'mocha';
import * as nock from 'nock';
import Database from '../src/database/database';

/**
 * before running any test
 * connect to mongodb database
 */
before(async() => {
  await Database.connect();
});

/**
 * after running every test :
 * - clean db state
 * - restore the HTTP interceptor to the normal unmocked behaviour
 * - disconnect db
 */
after(async() => {
  nock.restore();
  await Promise.all([ Database.deleteAll('users'), Database.deleteAll('alerts') ]);

  return Database.disconnect();
});

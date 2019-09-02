import 'mocha';
import Database from '../src/database/database';

/**
 * before running any test
 * connect to mongodb database
 */
before(async() => {
  await Database.connect();
});

/**
 * after running every test
 * shutdown db connection pool
 */
after(async() => {
  // await Promise.all([ Database.deleteAll('users'), Database.deleteAll('alerts') ]);

  return Database.disconnect();
});

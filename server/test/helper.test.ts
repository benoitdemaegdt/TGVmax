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
 * after running every test :
 * - clean db state
 * - disconnect db
 */
after(async() => {
  await Promise.all([ Database.deleteAll('users'), Database.deleteAll('alerts') ]);

  return Database.disconnect();
});

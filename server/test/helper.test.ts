import 'mocha';
import Database from '../src/database/db';

/**
 * after running every test
 * shutdown db connection pool
 */
after(async() => {
  await Promise.all([ Database.clear('travel_alerts'), Database.clear('users') ]);

  return Database.disconnect();
});

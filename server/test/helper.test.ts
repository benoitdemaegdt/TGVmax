import Database from '../src/database/db';

/**
 * after running every test
 * shutdown db connection pool
 */
after(async() => {
  return Database.disconnect();
});

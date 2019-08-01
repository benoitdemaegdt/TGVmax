import * as moment from 'moment-timezone';
import { Client, QueryResult } from 'pg';
import Config from './config';
import { Travel } from './travel';
import { IAvailability, ITravel } from './types';

/**
 * create postgreSQL client
 */
const client: Client = new Client({
  connectionString: Config.dbUrl,
});

(async(): Promise<void> => {
  /**
   * connect to db
   */
  await client.connect();

  /**
   * insert one travel and one user into the db
   * Note : this is temporary and will be handled by a proper API later
   */
  await client.query({
    text: `INSERT INTO travels(user_id, origin, destination, from_time, to_time, status, last_check)
    VALUES($1, $2, $3, $4, $5, $6, $7)`,
    values: [
      '4e7bcd15-bd14-42bf-8746-bf3e74784b12',
      'FRPAR',                        // EDIT HERE (find other train stations in ./data/trainStations.json)
      'FRNIT',                        // EDIT HERE (find other train stations in ./data/trainStations.json)
      '2019-08-07T00:30:00.987Z',     // EDIT HERE
      '2019-08-07T22:30:00.987Z',     // EDIT HERE
      'in_progress',
      '2019-07-31T15:30:00.987Z',
    ],
  });

  await client.query({
    text: 'INSERT INTO users(id, email, password, tgvmax_number) VALUES($1, $2, $3, $4)',
    values: [
      '4e7bcd15-bd14-42bf-8746-bf3e74784b12',
      'test@yopmail.com',
      'my_password',
      'HC000054321', // EDIT HERE : TGVMAX_NUMBER
    ],
  });

  /**
   * fetch all travels "in_progress" from database (only one here)
   */
  const res: QueryResult = await client.query({
    text: `SELECT origin, destination, from_time, to_time, tgvmax_number, email FROM travels, users
    WHERE travels.status = $1 AND travels.user_id = users.id`,
    values: ['in_progress'],
  });

  const data: ITravel[] = res.rows as ITravel[];

  /**
   * instantiate the travel
   * Note : this is temporary and will be a loop later
   */
  const isoStringLength: number = 19;
  const travel: Travel = new Travel(
    data[0].origin,
    data[0].destination,
    moment(data[0].from_time).tz('Europe/Paris').format().substring(0, isoStringLength),
    moment(data[0].to_time).tz('Europe/Paris').format().substring(0, isoStringLength),
    data[0].tgvmax_number,
  );

  /**
   * call oui.sncf to check tgvmax availability
   * Note : so far this is a "one shot" call. It will be a CRON later.
   */
  const availability: IAvailability = await travel.isTgvmaxAvailable();

  if (availability.isTgvmaxAvailable) {
    console.log(availability); // tslint:disable-line
  }

  /**
   * clear database table
   * Note : this is temporary
   */
  await Promise.all([
    client.query('DELETE FROM travels'),
    client.query('DELETE FROM users'),
  ]);

  /**
   * close connection
   */
  await client.end();

})()
.catch(async(err: Error) => {
  await Promise.all([
    client.query('DELETE FROM travels'),
    client.query('DELETE FROM users'),
  ]);
  await client.end();
  console.log(err); // tslint:disable-line
});

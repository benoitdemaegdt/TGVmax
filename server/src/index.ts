// import * as moment from 'moment-timezone';
import App from './app';
import Config from './config';
// import { Travel } from './travel';
// import { IAvailability, ITravel } from './types';

(async(): Promise<void> => {
  /**
   * Launch app
   */
  App.listen(Config.port);

  console.log(`App listening on port ${Config.port}`); // tslint:disable-line

})()
.catch((err: Error) => {
  console.log(err); // tslint:disable-line
});

// (async(): Promise<void> => {
//   /**
//    * connect to db
//    */
//   await Database.connect();

//   /**
//    * insert one travel and one user into the db
//    * Note : this is temporary and will be handled by a proper API later
//    */
//   await Database.insert('travels', {
//     user_id: '4e7bcd15-bd14-42bf-8746-bf3e74784b12',
//   origin: 'FRPAR',                              // EDIT HERE (find other train stations in ./data/trainStations.json)
//   destination: 'FRNIT',                         // EDIT HERE (find other train stations in ./data/trainStations.json)
//     from_time: '2019-08-07T00:30:00.987Z',        // EDIT HERE
//     to_time: '2019-08-07T22:30:00.987Z',          // EDIT HERE
//     status: 'in_progress',
//     last_check: '2019-07-31T15:30:00.987Z',
//   });

//   await Database.insert('users', {
//     id: '4e7bcd15-bd14-42bf-8746-bf3e74784b12',
//     email: 'test@yopmail.com',
//     password: 'my_password',
//     tgvmax_number: 'HC000054321',                 // EDIT HERE : TGVMAX_NUMBER
//   });

//   /**
//    * fetch all travels "in_progress" from database (only one here)
//    */
//   const data: ITravel[] = await Database.findTravel();

//   /**
//    * instantiate the travel
//    * Note : this is temporary and will be a loop later
//    */
//   const isoStringLength: number = 19;
//   const travel: Travel = new Travel(
//     data[0].origin,
//     data[0].destination,
//     moment(data[0].from_time).tz('Europe/Paris').format().substring(0, isoStringLength),
//     moment(data[0].to_time).tz('Europe/Paris').format().substring(0, isoStringLength),
//     data[0].tgvmax_number,
//   );

//   /**
//    * call oui.sncf to check tgvmax availability
//    * Note : so far this is a "one shot" call. It will be a CRON later.
//    */
//   const availability: IAvailability = await travel.isTgvmaxAvailable();

//   if (availability.isTgvmaxAvailable) {
//     console.log(availability); // tslint:disable-line
//   }

//   /**
//    * clear database table
//    * Note : this is temporary
//    */
//   await Promise.all([
//     Database.clear('travels'),
//     Database.clear('users'),
//   ]);

//   /**
//    * close connection
//    */
//   await Database.disconnect();

// })()
// .catch(async(err: Error) => {
//   await Promise.all([
//     Database.clear('travels'),
//     Database.clear('users'),
//   ]);
//   await Database.disconnect();
//   console.log(err); // tslint:disable-line
// });

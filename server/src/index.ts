import App from './App';
import Config from './Config';
import CronChecks from './core/CronChecks';
import Database from './database/database';

(async(): Promise<void> => {
  /**
   * connect to database
   */
  await Database.connect();

  /**
   * Launch app
   */
  App.listen(Config.port);

  console.log(`App listening on port ${Config.port}`); // tslint:disable-line

  /**
   * Launch CronJobs
   */
  CronChecks.init(Config.schedule);
})()
.catch((err: Error) => {
  console.log(err); // tslint:disable-line
});

import { isEmpty, random } from 'lodash';
import * as moment from 'moment-timezone';
import { ObjectId } from 'mongodb';
import * as cron from 'node-cron';
import Config from '../Config';
import Notification from '../core/Notification';
import Database from '../database/database';
import { IAvailability, ITravelAlert, IUser } from '../types';
import { SncfMobile } from './SncfMobile';
import { Trainline } from './Trainline';

/**
 * Periodically check Tgvmax availability
 * How does it work ?
 * 1/ every x min (let's say 30min) a cronjob will fetch travelAlerts with status: 'pending' in db
 * 2/ for each travelAlert, check if a tgvmax seat is available
 * 3/ if YES -> update status to 'triggered' and send notification
 *    if NO  -> update lastCheck to current time and continue
 */
class CronChecks {
  /**
   * init CronJob
   */
  public readonly init = (schedule: string): void => {
    cron.schedule(schedule, async() => {
      try {
        const travelAlerts: ITravelAlert[] = await this.fetchPendingTravelAlerts();
        if (isEmpty(travelAlerts) || Config.disableCronCheck) {
          return;
        }

        console.log(`${moment(new Date()).tz('Europe/Paris').format('DD-MM-YYYY HH:mm:ss')} - processing ${travelAlerts.length} travelAlerts`); // tslint:disable-line
        /**
         * Process each travelAlert
         * Send notification if tgvmax seat is available
         */
        for (const travelAlert of travelAlerts) {
          let availability: IAvailability;

          /**
           * split load on trainline and sncf mobile APIs
           */
          if (random(0, 1) === 0) {
            console.log(`${moment(new Date()).tz('Europe/Paris').format('DD-MM-YYYY HH:mm:ss')} - processing travelAlert ${travelAlert._id} - trainline API`); // tslint:disable-line
            const trainline: Trainline = new Trainline(
              travelAlert.origin.trainlineId,
              travelAlert.destination.trainlineId,
              travelAlert.fromTime,
              travelAlert.toTime,
              travelAlert.tgvmaxNumber,
            );
            availability = await trainline.isTgvmaxAvailable();
          } else {
            console.log(`${moment(new Date()).tz('Europe/Paris').format('DD-MM-YYYY HH:mm:ss')} - processing travelAlert ${travelAlert._id} - sncf API`); // tslint:disable-line
            const sncfMobile: SncfMobile = new SncfMobile(
              travelAlert.origin.sncfId,
              travelAlert.destination.sncfId,
              travelAlert.fromTime,
              travelAlert.toTime,
              travelAlert.tgvmaxNumber,
            );
            availability = await sncfMobile.isTgvmaxAvailable();
          }

          if (!availability.isTgvmaxAvailable) {
            await Database.updateOne('alerts', {_id: new ObjectId(travelAlert._id)}, {$set: {lastCheck: new Date()}});
            await this.delay(Config.delay);
            continue;
          }

          /**
           * if is TGVmax is available : send email
           */
          console.log(`${moment(new Date()).tz('Europe/Paris').format('DD-MM-YYYY HH:mm:ss')} - travelAlert ${travelAlert._id} triggered`); // tslint:disable-line
          const email: string = await this.fetchEmailAddress(travelAlert.userId);
          await Notification.sendEmail(
            email,
            travelAlert.origin.name,
            travelAlert.destination.name,
            travelAlert.fromTime,
            availability.hours,
          );
          /**
           * update travelALert status
           */
          await Database.updateOne('alerts', { _id: new ObjectId(travelAlert._id) }, {
            $set: { status: 'triggered', triggeredAt: new Date() },
          },
          );
          await this.delay(Config.delay);
        }
      } catch (err) {
        console.log(err); // tslint:disable-line
      }
    });
  }

  /**
   * fetch all pending travelAlert in database
   */
  private readonly fetchPendingTravelAlerts = async(): Promise<ITravelAlert[]> => {
    return Database.find<ITravelAlert>('alerts', {
      status: 'pending',
      fromTime: { $gt: new Date() },
    });
  }

  /**
   * fetch all pending travelAlert in database
   */
  private readonly fetchEmailAddress = async(userId: string): Promise<string> => {
    const user: IUser[] = await Database.find<IUser>('users', {
      _id: new ObjectId(userId),
    });

    return user[0].email;
  }

  /**
   * delay function
   */
  private readonly delay = async(ms: number): Promise<void> => {
    type IResolve = (value?: void | PromiseLike<void> | undefined) => void;

    return new Promise((resolve: IResolve): number => setTimeout(resolve, ms));
  }
}

export default new CronChecks();

import { isEmpty } from 'lodash';
import * as moment from 'moment-timezone';
import { ObjectId } from 'mongodb';
import * as cron from 'node-cron';
import Config from '../Config';
import Notification from '../core/Notification';
import Database from '../database/database';
import { IAvailability, ITravelAlert, IUser } from '../types';
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
    cron.schedule(schedule, async() =>  {
      try {
        const travelAlerts: ITravelAlert[] = await this.fetchPendingTravelAlerts();
        if (isEmpty(travelAlerts)) {
          return;
        }

        /**
         * Process each travelAlert
         * Send notification if tgvmax seat is available
         */
        for (const travelAlert of travelAlerts) {
          console.log(`processing travelAlert ${travelAlert._id}`); // tslint:disable-line

          const trainline: Trainline = new Trainline(
            travelAlert.origin.trainlineId,
            travelAlert.destination.trainlineId,
            moment(travelAlert.fromTime).tz('Europe/Paris').format('YYYY-MM-DD[T]HH:mm:ss'),
            moment(travelAlert.toTime).tz('Europe/Paris').format('YYYY-MM-DD[T]HH:mm:ss'),
            travelAlert.tgvmaxNumber,
          );

          const availability: IAvailability = await trainline.isTgvmaxAvailable();
          if (!availability.isTgvmaxAvailable) {
            await Database.updateOne('alerts', {_id: new ObjectId(travelAlert._id)}, {$set: {lastCheck: new Date()}});
            await this.delay(Config.delay);
            continue;
          }

          /**
           * if is TGVmax is available : send email
           */
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
          await Database.updateOne('alerts', {_id: new ObjectId(travelAlert._id)}, {
            $set: {status: 'triggered', triggeredAt: new Date()}},
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
    const user: IUser[] = await  Database.find<IUser>('users', {
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

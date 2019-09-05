import { isEmpty } from 'lodash';
import * as cron from 'node-cron';
import Database from '../database/database';
import { IAvailability, ITravelAlert } from '../types';
import { TgvmaxTravel } from './TgvmaxTravel';

/**
 * Periodically check Tgvmax availability
 * How does it work ?
 * 1/ every x min (let's say 30min) a cronjob will fetch travelAlerts with status: 'pending' in db
 * 2/ for each travelAlert, check if a tgvmax seat is available
 * 3/ if YES -> update status to 'triggered' and send notification
 *    if NO  -> do nothing until next check
 */
class CronChecks {
  /**
   * init CronJob
   */
  public readonly init = (schedule: string): void => {
    const MAX_DATE_LENGTH: number = 19;

    cron.schedule(schedule, async() =>  {
      const travelAlerts: ITravelAlert[] = await this.fetchPendingTravelAlerts();
      if (isEmpty(travelAlerts)) {
        return;
      }

      /**
       * Process each travelAlert
       * Send notification if tgvmax seat is available
       */
      for (const travelAlert of travelAlerts) {
        const tgvmaxTravel: TgvmaxTravel = new TgvmaxTravel(
          travelAlert.origin.code,
          travelAlert.destination.code,
          travelAlert.fromTime.toISOString().substring(0, MAX_DATE_LENGTH),
          travelAlert.toTime.toISOString().substring(0, MAX_DATE_LENGTH),
          travelAlert.tgvmaxNumber,
        );

        const availability: IAvailability = await tgvmaxTravel.isAvailable();
        if (!availability.isTgvmaxAvailable) {
          continue;
        }
        // TODO: send notification
        console.log(availability.hours); // tslint:disable-line
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
}

export default new CronChecks();

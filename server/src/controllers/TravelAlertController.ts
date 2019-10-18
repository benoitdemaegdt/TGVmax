import { isEmpty } from 'lodash';
import * as moment from 'moment-timezone';
import { DeleteWriteOpResultObject, InsertOneWriteOpResult , ObjectId } from 'mongodb';
import Config from '../Config';
import Database from '../database/database';
import { BusinessError } from '../errors/BusinessError';
import { NotFoundError } from '../errors/NotFoundError';
import { ITravelAlert, IUser } from '../types';

/**
 * Travel controller
 */
class TravelAlertController {

  private readonly collectionAlerts: string;

  constructor() {
    this.collectionAlerts = 'alerts';
  }

  /**
   * Add a travelAlert to database
   */
  public async addTravelAlert(userId: string, travelAlert: ITravelAlert): Promise<string> {
    /**
     * check that user actually exists in db
     * (there is no foreign key constraint in mongo)
     */
    const user: IUser[] = await Database.find<IUser>('users', {
      _id: new ObjectId(userId),
    });
    if (isEmpty(user)) {
      throw new NotFoundError('user not found');
    }

    /**
     * reject if too many alerts for this user
     */
    const userPendingAlerts: ITravelAlert[] = await Database.find<ITravelAlert>(this.collectionAlerts, {
      status: 'pending',
      tgvmaxNumber: user[0].tgvmaxNumber,
      fromTime: {
        $gt: new Date(),
      },
    });
    if (userPendingAlerts.length >= Config.maxAlertsPerUser) {
      throw new BusinessError(`Limite atteinte : ${Config.maxAlertsPerUser} alertes en cours`);
    }

    /**
     * reject if a similar alert exists on the same day
     */
    for (const alert of userPendingAlerts) {
      if (
        travelAlert.origin.name === alert.origin.name
        && travelAlert.destination.name === alert.destination.name
        && moment(travelAlert.fromTime).isSame(alert.fromTime, 'day')
      ) {
        throw new BusinessError('Une alerte similaire existe déjà');
      }
    }

    /**
     * insert alert in db
     */
    const insertOp: InsertOneWriteOpResult<ITravelAlert> =
      await Database.insertOne<ITravelAlert>(this.collectionAlerts, {
      userId: new ObjectId(userId),
      tgvmaxNumber: user[0].tgvmaxNumber,
      origin: travelAlert.origin,
      destination: travelAlert.destination,
      fromTime: new Date(travelAlert.fromTime),
      toTime: new Date(travelAlert.toTime),
      status: 'pending',
      lastCheck: new Date(),
      createdAt: new Date(),
    });

    return insertOp.insertedId.toString();
  }

  /**
   * Get one user travelAlert from database
   */
  public async getTravelAlert(userId: string, travelAlertId: string): Promise<ITravelAlert[]> {
    return Database.find<ITravelAlert>(this.collectionAlerts, {
      _id: new ObjectId(travelAlertId),
      userId: new ObjectId(userId),
    });
  }

  /**
   * Get all user travelAlerts from database
   */
  public async getAllPendingTravelAlerts(userId: string): Promise<ITravelAlert[]> {
    return Database.find<ITravelAlert>(this.collectionAlerts, {
      userId: new ObjectId(userId),
      status: 'pending',
      fromTime: { $gt: new Date() },
    });
  }

  /**
   * Delete TravelAlert
   */
  public async deleteTravelAlert(userId: string, travelAlertId: string): Promise<number | undefined> {
    const deleteOp: DeleteWriteOpResultObject = await Database.deleteOne(this.collectionAlerts, {
      _id: new ObjectId(travelAlertId),
      userId: new ObjectId(userId),
    });

    return deleteOp.result.n;
  }
}

export default new TravelAlertController();

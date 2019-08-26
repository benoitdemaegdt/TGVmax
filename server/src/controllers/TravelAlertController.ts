import { QueryResult } from 'pg';
import Database from '../database/db';
import { ITravelAlert } from '../types';

/**
 * Travel controller
 */
class TravelAlertController {

  /**
   * Add a travelAlert to database
   */
  public async addTravelAlert(userId: string, travelAlert: ITravelAlert): Promise<string> {
    const insertOp: QueryResult = await Database.insert('travel_alerts', {
      user_id: userId,
      origin: travelAlert.origin,
      destination: travelAlert.destination,
      from_time: travelAlert.fromTime,
      to_time: travelAlert.toTime,
    });

    const rows: {id: string}[] = insertOp.rows as {id: string}[];

    return rows[0].id;
  }

  /**
   * Get one user travelAlert from database
   */
  public async getTravelAlert(userId: string, travelAlertId: string): Promise<ITravelAlert[]> {
    return Database.find<ITravelAlert>('travel_alerts', {
      user_id: userId,
      id: travelAlertId,
    });
  }

  /**
   * Get all user travelAlerts from database
   */
  public async getAllTravelAlerts(userId: string): Promise<ITravelAlert[]> {
    return Database.find<ITravelAlert>('travel_alerts', {
      user_id: userId,
    });
  }

  /**
   * Delete TravelAlert
   */
  public async deleteTravelAlert(userId: string, travelAlertId: string): Promise<QueryResult> {
    return Database.delete('travel_alerts', {
      id: travelAlertId,
      user_id: userId,
    });
  }
}

export default new TravelAlertController();

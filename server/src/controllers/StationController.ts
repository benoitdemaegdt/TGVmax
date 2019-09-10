import Database from '../database/database';
import { IStation } from '../types';

/**
 * Station controller
 */
class StationController {

  private readonly collectionStations: string;

  constructor() {
    this.collectionStations = 'stations';
  }

  /**
   * fetch train stations stored in database
   * TODO: autocomplete feature with text index
   */
  public async getStations(): Promise<IStation[]> {
    return Database.find<IStation>(this.collectionStations, {}, {_id: 0});
  }
}

export default new StationController();

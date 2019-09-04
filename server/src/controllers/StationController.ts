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
  public async getStations(): Promise<string[]> {
    const stations: IStation[] = await Database.find<IStation>(this.collectionStations, {});

    return stations.map((station: IStation) => {
      return station.name;
    });
  }
}

export default new StationController();

import { filter, isEmpty, map, uniq } from 'lodash';
import * as moment from 'moment-timezone';
import * as request from 'superagent';
import * as uuidv4 from 'uuid/v4';
import Config from '../Config';
import { IAvailability, ITrainlineTrain } from '../types';
/**
 * Trainline
 * Fetch Tgvmax availabilities from trainline.fr
 */
export class Trainline {
  /**
   * departure station
   */
  private readonly origin: string;

  /**
   * destination station
   */
  private readonly destination: string;

  /**
   * earliest train on which we want to set up an alert
   */
  private readonly fromTime: string;

  /**
   * latest train on which we want to set up an alert
   */
  private readonly toTime: string;

  /**
   * TGVmax number
   */
  private readonly tgvmaxNumber: string;

  constructor(origin: string, destination: string, fromTime: string, toTime: string, tgvmaxNumber: string) {
    this.origin = origin;
    this.destination = destination;
    this.fromTime = fromTime;
    this.toTime = toTime;
    this.tgvmaxNumber = tgvmaxNumber;
  }

  /**
   * Check if there is a tgvmax seat available on a train :
   * - leaving train station : origin
   * - going to train station : destination
   * - leaving between fromTime and toTime
   */
  public async isTgvmaxAvailable(): Promise<IAvailability> {
    const tgvmaxHours: string[] = await this.getTgvmaxHours();
    /**
     * If previous call returns an empty array, there is no TGVmax available
     */
    if (isEmpty(tgvmaxHours)) {
      return {
        isTgvmaxAvailable: false,
        hours: [],
      };
    }

    return {
      isTgvmaxAvailable: true,
      hours: uniq(tgvmaxHours),
    };
  }

  /**
   * Get Train with a TGVmax seat available from Trainline API
   */
  private async getTgvmaxHours(): Promise<string[]> {

    const results: ITrainlineTrain[] = [];
    let keepSearching: boolean = true;
    let fromTime: string = this.fromTime;

    try {
      while (keepSearching) {
        const response: request.Response = await request
        .post(`${Config.baseTrainlineUrl}/api/v5_1/search`)
        .set({
          Accept: 'application/json',
          'User-Agent': 'CaptainTrain/43(4302) Android/4.4.2(19)',
          'Accept-Language': 'fr',
          'Content-Type': 'application/json; charset=UTF-8',
          Host: 'www.trainline.eu',
        })
        .send({
          local_currency: 'EUR',
          search: {
            passengers: [
              {
                age: 25, // random
                id: uuidv4(), // random uuid
                label: uuidv4(), // random uuid
                cards: [{
                  reference: 'SNCF.HappyCard',
                  number: this.tgvmaxNumber,
                }],
              },
            ],
            departure_station_id: this.origin,
            arrival_station_id: this.destination,
            departure_date: this.getTrainlineDate(fromTime),
            systems: [
              'sncf',
            ],
          },
        });

        const pageResults: {trips: ITrainlineTrain[]} = JSON.parse(response.text) as {trips: ITrainlineTrain[]};
        const pageTrips: ITrainlineTrain[] = pageResults.trips;

        results.push(...pageTrips);

        const pageLastTripDeparture: string = moment(pageTrips[pageTrips.length - 1].departure_date)
          .tz('Europe/Paris').format('YYYY-MM-DD[T]HH:mm:ss');

        if (moment(this.toTime).isSameOrBefore(pageLastTripDeparture)
          || moment(fromTime).isSame(pageLastTripDeparture)) {
          keepSearching = false;
        }

        fromTime = pageLastTripDeparture;
      }
    } catch (error) {
      console.log(error); // tslint:disable-line
    }

    /**
     * 1/ filter out trains with no TGVmax seat available
     * 2/ filter out trains leaving after toTime
     */
    const tgvmaxTravels: ITrainlineTrain[] = filter(results, (item: ITrainlineTrain) => {
      const departureDate: string = moment(item.departure_date).tz('Europe/Paris').format('YYYY-MM-DD[T]HH:mm:ss');

      return item.cents === 0 && moment(departureDate).isSameOrBefore(this.toTime);
    });

    return map(tgvmaxTravels, (tgvmaxTravel: ITrainlineTrain) => {
      return moment(tgvmaxTravel.departure_date).tz('Europe/Paris').format('HH:mm');
    });
  }

  /**
   * trainline input date is GMT + current UTC/GMT offset
   */
  private readonly getTrainlineDate = (time: string): string => {
    const minInHour: number = 60;
    const utcOffset: number = moment(new Date()).tz('Europe/Paris').utcOffset() / minInHour;

    return moment(time).add(utcOffset, 'hours').format('YYYY-MM-DD[T]HH:mm:ss');
  }
}

import { get, map, pick } from 'lodash';
import * as request from 'superagent';
import Config from './config';
import { ITrain } from './types';

/**
 * This class is about fetching data from oui.sncf
 */
export class Travel {
  /**
   * url used to fetch data
   */
  private readonly url: string;

  /**
   * departure station
   */
  private readonly origin: string;

  /**
   * destination station
   */
  private readonly destination: string;

  /**
   * travel date
   */
  private readonly date: string;

  /**
   * TGVmax number
   */
  private readonly tgvmaxNumber: string;

  constructor(origin: string, destination: string, date: string, tgvmaxNumber: string) {
    this.url = `${Config.baseUrl}/proposition/rest/travels/outward/train/next`;
    this.origin = origin;
    this.destination = destination;
    this.date = date;
    this.tgvmaxNumber = tgvmaxNumber;
  }

  /**
   * The oui.sncf API returns trains (approximately) 5 by 5.
   * This function returns the min price of all the trains leaving between the travel date and the end of the day
   */
  public async getAllMinPrices(): Promise<ITrain[]> {
    const trains: ITrain[] = [];
    /**
     * init with response from a first API call
     */
    trains.push(...await this.getMinPrices(this.date));
    /**
     * keep calling the API until we receive a single train (last one)
     */
    let isMoreTrainsToFetch: boolean = true;
    while (isMoreTrainsToFetch) {
      const nexTrains: ITrain[] = await this.getMinPrices(get(trains[trains.length - 1], ['departureDate']));
      if (nexTrains.length === 1) {
        isMoreTrainsToFetch = false;
      }
      nexTrains.shift();
      trains.push(...nexTrains);
    }

    return trains;
  }

  /**
   * The oui.sncf API returns trains 5 by 5.
   * This function returns the min price of the 5 trains leaving after the given time
   */
  private async getMinPrices(time: string): Promise<ITrain[]> {
    const response: request.Response = await request
      .post(this.url)
      .send({
        context: {
          paginationContext: {
            travelSchedule: {
              departureDate: time,
            },
          },
        },
        wish: {
          mainJourney: {
            origin: {
              code: this.origin,
            },
            destination: {
              code: this.destination,
            },
          },
          schedule: {
            outward: this.date,
          },
          travelClass: 'SECOND',
          passengers: [
            {
              typology: 'YOUNG',
              discountCard: {
                code: 'HAPPY_CARD',
                number: this.tgvmaxNumber,
                dateOfBirth: '1995-03-06', // random
              },
            },
          ],
          directTravel: true,
          salesMarket: 'fr-FR',
        },
      },
    );
    /**
     * filter out everything except trains details
     */
    const body: {travelProposals: ITrain[]} = get(response, 'body') as {travelProposals: ITrain[]};
    const travelProposals: ITrain[] = get(body, ['travelProposals']);

    /**
     * filter out useless trains details
     */
    return map(travelProposals, (trainDetails: ITrain) => {
      return pick(trainDetails, ['departureDate', 'arrivalDate', 'minPrice']);
    });
  }
}

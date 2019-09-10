import { filter, get, isEmpty, map, pick } from 'lodash';
import * as moment from 'moment-timezone';
import * as request from 'superagent';
import Config from '../Config';
import { IAvailability, ITrain } from '../types';

/**
 * Tgvmax Travel
 * Fetch Tgvmax availabilities from oui.sncf
 */
export class TgvmaxTravel {
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
  public async isAvailable(): Promise<IAvailability> {
    const tgvmax: ITrain[] = await this.getTgvmax();
    /**
     * If previous call returns an empty array, there is no TGVmax available
     */
    if (isEmpty(tgvmax)) {
      return {
        isTgvmaxAvailable: false,
        hours: [],
      };
    }

    return {
      isTgvmaxAvailable: true,
      hours: tgvmax.map((train: ITrain) => moment(train.departureDate).format('HH:mm')),
    };
  }

  /**
   * The oui.sncf API returns trains (approximately) 5 by 5.
   * This function returns trains leaving between the travel date and the end of the day
   * with at least one TGVmax seat available
   */
  private async getTgvmax(): Promise<ITrain[]> {
    const trains: ITrain[] = [];
    /**
     * init with response from a first API call
     */
    trains.push(...await this.getMinPrices(this.fromTime));
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

    /**
     * Only return trains leaving in the good time range with a TGVmax seat available
     */
    return filter(trains, (train: ITrain) => {
      return train.minPrice === 0 && moment(train.departureDate).isBefore(moment(this.toTime));
    });
  }

  /**
   * The oui.sncf API returns trains 5 by 5.
   * This function returns the min price of the 5 trains leaving after the given time
   */
  private async getMinPrices(time: string): Promise<ITrain[]> {
    const response: request.Response = await request
      .post(`${Config.baseUrl}/proposition/rest/travels/outward/train/next`)
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
            outward: time,
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
     * filter out the noise (everything except trains details)
     */
    const body: {travelProposals: ITrain[]} = get(response, 'body') as {travelProposals: ITrain[]};
    const travelProposals: ITrain[] = get(body, ['travelProposals']);

    /**
     * filter out useless trains details
     */
    return map(travelProposals, (train: ITrain) => {
      return pick(train, ['departureDate', 'arrivalDate', 'minPrice']);
    });
  }
}

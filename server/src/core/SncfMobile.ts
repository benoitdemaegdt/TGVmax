import Axios, { AxiosResponse } from 'axios';
import { filter, isEmpty, isNil, map, uniq } from 'lodash';
import * as moment from 'moment-timezone';
import Config from '../Config';
import { IAvailability, ISncfMobileTrain } from '../types';

/**
 * SncfMobile
 * Fetch Tgvmax availabilities from oui.sncf mobile API
 */
export class SncfMobile {
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

  constructor(origin: string, destination: string, fromTime: Date, toTime: Date, tgvmaxNumber: string) {
    this.origin = origin;
    this.destination = destination;
    this.fromTime = moment(fromTime).tz('Europe/Paris').format('YYYY-MM-DD[T]HH:mm:ss');
    this.toTime = moment(toTime).tz('Europe/Paris').format('YYYY-MM-DD[T]HH:mm:ss');
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
   * Get Train with a TGVmax seat available from Sncf mobile API
   */
  private async getTgvmaxHours(): Promise<string[]> {

    const results: ISncfMobileTrain[] = [];
    let keepSearching: boolean = true;
    let fromTime: string = this.fromTime;

    try {
      while (keepSearching) {
        const response: AxiosResponse = await Axios.request({
          url: `${Config.baseSncfMobileUrl}/m650/vmd/maq/v3/proposals/train`,
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'User-Agent': 'OUI.sncf/65.1.1 CFNetwork/1107.1 Darwin/19.0.0',
            'Accept-Language': 'fr-FR ',
            'Content-Type': 'application/json;charset=UTF8',
            Host: 'wshoraires.oui.sncf',
            'x-vsc-locale': 'fr_FR',
            'X-Device-Type': 'IOS',
          },
          data: {
            departureTown: {
              codes: {
                resarail: this.origin,
              },
            },
            destinationTown: {
              codes: {
                resarail: this.destination,
              },
            },
            features: [
              'TRAIN_AND_BUS',
              'DIRECT_TRAVEL',
            ],
            outwardDate: moment(fromTime).format('YYYY-MM-DD[T]HH:mm:ss.SSSZ'),
            passengers: [
              {
                age: 25, // random
                ageRank: 'YOUNG',
                birthday: '1995-03-06', // random
                commercialCard: {
                  number: this.tgvmaxNumber,
                  type: 'HAPPY_CARD',
                },
                type: 'HUMAN',
              },
            ],
            travelClass: 'SECOND',
          },
        });

        const pageResults: {journeys: ISncfMobileTrain[]} = response.data as {journeys: ISncfMobileTrain[]};
        const pageJourneys: ISncfMobileTrain[] = pageResults.journeys;

        results.push(...pageJourneys);

        const pageLastTripDeparture: string = moment(pageJourneys[pageJourneys.length - 1].departureDate)
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
    const tgvmaxTravels: ISncfMobileTrain[] = filter(results, (item: ISncfMobileTrain) => {
      const departureDate: string = moment(item.departureDate).tz('Europe/Paris').format('YYYY-MM-DD[T]HH:mm:ss');

      return isNil(item.unsellableReason)
        && item.price.value === 0
        && moment(departureDate).isSameOrBefore(this.toTime);
    });

    return map(tgvmaxTravels, (tgvmaxTravel: ISncfMobileTrain) => {
      return moment(tgvmaxTravel.departureDate).tz('Europe/Paris').format('HH:mm');
    });
  }
}

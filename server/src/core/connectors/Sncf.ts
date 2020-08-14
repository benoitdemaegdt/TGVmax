import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import * as httpsProxyAgent from 'https-proxy-agent';
import { filter, get, isEmpty, isNil, map, random, uniq } from 'lodash';
import * as moment from 'moment-timezone';
import Config from '../../Config';
import { IAvailability, IConnectorParams, ISncfMobileTrain } from '../../types';

/**
 * Sncf connector
 */
class Sncf {
  /**
   * connector generic function
   */
  public async isTgvmaxAvailable({
    origin, destination, fromTime, toTime, tgvmaxNumber,
  }: IConnectorParams): Promise<IAvailability> {
    const tgvmaxHours: string[] = await this.getTgvmaxHours({
      origin, destination, fromTime, toTime, tgvmaxNumber,
    });

    /**
     * If previous call returns an empty array, there is no TGVmax available
     */
    return isEmpty(tgvmaxHours)
      ? { isTgvmaxAvailable: false, hours: [] }
      : { isTgvmaxAvailable: true, hours: uniq(tgvmaxHours) };
  }

  /**
   * get data from sncf api
   */
  private readonly getTgvmaxHours = async({
    origin, destination, fromTime, toTime, tgvmaxNumber,
  }: IConnectorParams): Promise<string[]> => {
    const results: ISncfMobileTrain[] = [];
    let keepSearching: boolean = true;
    let departureMinTime: string = moment(fromTime).tz('Europe/Paris').format('YYYY-MM-DD[T]HH:mm:ss');
    const departureMaxTime: string = moment(toTime).tz('Europe/Paris').format('YYYY-MM-DD[T]HH:mm:ss');

    try {
      while (keepSearching) {
        const config: AxiosRequestConfig = {
          url: `${Config.baseSncfMobileUrl}/m770/vmd/maq/v3/proposals/train`,
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
                resarail: origin.sncfId,
              },
            },
            destinationTown: {
              codes: {
                resarail: destination.sncfId,
              },
            },
            features: [
              'TRAIN_AND_BUS',
              'DIRECT_TRAVEL',
            ],
            outwardDate: moment(departureMinTime).format('YYYY-MM-DD[T]HH:mm:ss.SSSZ'),
            passengers: [
              {
                age: 25, // random
                ageRank: 'YOUNG',
                birthday: '1995-03-06', // random
                commercialCard: {
                  number: tgvmaxNumber,
                  type: 'HAPPY_CARD',
                },
                type: 'HUMAN',
              },
            ],
            travelClass: 'SECOND',
          },
        };

        /**
         * split load between multiple servers
         */
        if (process.env.NODE_ENV === 'production' && !isNil(Config.proxyUrl)) {
          config.httpsAgent = new httpsProxyAgent(Config.proxyUrl);
        }

        /**
         * interceptor for handling sncf 200 ok that should be 500 or 301
         */
        Axios.interceptors.response.use(async(res: AxiosResponse) => {
          const data: {exceptionType?: string} = res.data as {exceptionType?: string};
          if (!isNil(data.exceptionType)) {
            return Promise.reject({
              response: {
                status: 500,
                statusText: data.exceptionType,
              },
            });
          }

          return res;
        });

        /**
         * get data from oui.sncf
         */
        const response: AxiosResponse = await Axios.request(config);

        const pageResults: {journeys: ISncfMobileTrain[]} = response.data as {journeys: ISncfMobileTrain[]};
        const pageJourneys: ISncfMobileTrain[] = pageResults.journeys;

        results.push(...pageJourneys);

        const pageLastTripDeparture: string = moment(pageJourneys[pageJourneys.length - 1].departureDate)
        .tz('Europe/Paris').format('YYYY-MM-DD[T]HH:mm:ss');

        if (moment(departureMaxTime).isSameOrBefore(pageLastTripDeparture)
          || moment(departureMinTime).isSame(pageLastTripDeparture)) {
          keepSearching = false;
        }

        departureMinTime = pageLastTripDeparture;
      }
    } catch (error) {
      const status: number = get(error, 'response.status', ''); // tslint:disable-line
      const statusText: string = get(error, 'response.statusText', ''); // tslint:disable-line
      const label: string = get(error, 'response.data.label', ''); // tslint:disable-line
      console.log(`SNCF API ERROR : ${status} ${statusText} ${label}`); // tslint:disable-line
    }

    /**
     * 1/ filter out trains with no TGVmax seat available
     * 2/ filter out trains leaving after toTime
     */
    const tgvmaxTravels: ISncfMobileTrain[] = filter(results, (item: ISncfMobileTrain) => {
      const departureDate: string = moment(item.departureDate).tz('Europe/Paris').format('YYYY-MM-DD[T]HH:mm:ss');

      return isNil(item.unsellableReason)
        && item.price.value === 0
        && moment(departureDate).isSameOrBefore(departureMaxTime);
    });

    return map(tgvmaxTravels, (tgvmaxTravel: ISncfMobileTrain) => {
      return moment(tgvmaxTravel.departureDate).tz('Europe/Paris').format('HH:mm');
    });
  }

}

export default new Sncf();

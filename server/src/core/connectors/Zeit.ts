import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import Config from '../../Config';
import { IAvailability, IConnectorParams } from '../../types';

/**
 * Zeit connector
 */
class Zeit {
  /**
   * connector generic function
   */
  public async isTgvmaxAvailable({ origin, destination, fromTime, toTime, tgvmaxNumber }: IConnectorParams): Promise<IAvailability> {

    const config: AxiosRequestConfig = {
      url: 'https://maxplorateur.now.sh/api/travels',
      method: 'POST',
      auth: {
        username: Config.zeitUsername as string,
        password: Config.zeitPassword as string,
      },
      data: {
        origin: origin.sncfId,
        destination: destination.sncfId,
        fromTime,
        toTime,
        tgvmaxNumber
      },
    };

    try {
      const response: AxiosResponse = await Axios.request(config);
      return response.data;
    } catch(error) {
      console.log(error);
      return {
        isTgvmaxAvailable: false,
        hours: [],
      };
    }
  }
}

export default new Zeit();
import { isNil } from 'lodash';

/**
 * Config class
 */
export class Config {
  /**
   * App port
   */
  public port: number = 3001;

  /**
   * oui.sncf base url
   */
  public baseUrl: string;

  /**
   * database url
   */
  public dbUrl: string;

  /**
   * jwt secret
   */
  public jwtSecret: string;

  /**
   * jwt duration
   */
  public jwtDuration: string;

  /**
   * cronjob schedule
   */
  public schedule: string;

  constructor() {
    this.baseUrl = 'https://www.oui.sncf';
    this.dbUrl = isNil(process.env.DB_URL)
      ? `mongodb://localhost:27017/${process.env.NODE_ENV === 'test' ? 'test' : 'maxplorateur'}`
      : process.env.DB_URL;
    this.jwtSecret = isNil(process.env.JWT_SECRET) ? 'mySecret' : process.env.JWT_SECRET;
    this.jwtDuration = isNil(process.env.JWT_DURATION) ? '365 days' : process.env.JWT_DURATION;
    this.schedule = isNil(process.env.SCHEDULE) ? '*/30 * * * * *' : process.env.SCHEDULE;
  }
}

/**
 * Config is a singleton
 */
export default new Config();

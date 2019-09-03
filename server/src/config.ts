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

  constructor() {
    this.baseUrl = 'https://www.oui.sncf';
    this.dbUrl = 'mongodb://localhost:27017/maxplorateur';
    this.jwtSecret = isNil(process.env.JWT_SECRET) ? 'mySecret' : process.env.JWT_SECRET;
    this.jwtDuration = isNil(process.env.JWT_DURATION) ? '365 days' : process.env.JWT_DURATION;
  }
}

/**
 * Config is a singleton
 */
export default new Config();

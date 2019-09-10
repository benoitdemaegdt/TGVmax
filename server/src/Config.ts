import * as config from 'config';

/**
 * Config class
 */
export class Config {
  /**
   * App port
   */
  public port: number = 3000;

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

  /**
   * gmail user
   */
  public email: string;

  /**
   * gmail password
   */
  public password: string;

  /**
   * vuejs port
   */
  public frontPort: string;

  /**
   * minimum delay between calls to oui.sncf
   */
  public delay: number;

  constructor() {
    /* tslint:disable */
    this.baseUrl = 'https://www.oui.sncf';
    this.dbUrl = process.env.DB_URL || config.get('dbUrl');
    this.jwtSecret = process.env.JWT_SECRET || config.get('jwtSecret');
    this.jwtDuration = process.env.JWT_DURATION || config.get('jwtDuration');
    this.schedule = process.env.SCHEDULE || config.get('schedule');
    this.email = process.env.EMAIL || config.get('email');
    this.password = process.env.PASSWORD || config.get('password');
    this.frontPort = process.env.FRONT_PORT || config.get('frontPort');
    this.delay = Number(process.env.DELAY) || config.get('delay');
  }
}

/**
 * Config is a singleton
 */
export default new Config();

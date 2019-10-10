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
  public baseSncfWebUrl: string;

  /**
   * oui.sncf mobile base url
   */
  public baseSncfMobileUrl: string;

  /**
   * trainline base url
   */
  public baseTrainlineUrl: string;

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
   * cors whitelist
   */
  public whitelist: string;

  /**
   * minimum delay between calls to oui.sncf
   */
  public delay: number;

  constructor() {
    /* tslint:disable */
    this.baseSncfWebUrl = 'https://www.oui.sncf';
    this.baseSncfMobileUrl = 'https://wshoraires.oui.sncf';
    this.baseTrainlineUrl = 'https://www.trainline.eu';
    this.dbUrl = process.env.DB_URL || config.get('dbUrl');
    this.jwtSecret = process.env.JWT_SECRET || config.get('jwtSecret');
    this.jwtDuration = process.env.JWT_DURATION || config.get('jwtDuration');
    this.schedule = process.env.SCHEDULE || config.get('schedule');
    this.email = process.env.EMAIL || config.get('email');
    this.password = process.env.PASSWORD || config.get('password');
    this.whitelist = process.env.WHITELIST || this.getWhitelist();
    this.delay = Number(process.env.DELAY) || config.get('delay');
  }

  private getWhitelist = (): string => {
    if (process.env.NODE_ENV === 'production') {
      return 'http://maxplorateur.fr';
    } else {
      return 'http://localhost:8080';
    }
  }
}

/**
 * Config is a singleton
 */
export default new Config();

/**
 * Config class
 */
export class Config {
  /**
   * App port
   */
  public port: number;

  /**
   * oui.sncf base url
   */
  public baseUrl: string;

  /**
   * database url
   */
  public dbUrl: string;

  constructor() {
    this.port = 3001; // tslint:disable-line
    this.baseUrl = 'https://www.oui.sncf';
    this.dbUrl = 'postgres://postgres:@localhost:5432/tgvmax';
  }
}

/**
 * Config is a singleton
 */
export default new Config();

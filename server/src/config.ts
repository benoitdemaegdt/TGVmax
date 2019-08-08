/**
 * Config class
 */
export class Config {
  /**
   * oui.sncf base url
   */
  public baseUrl: string;

  /**
   * database url
   */
  public dbUrl: string;

  constructor() {
    this.baseUrl = 'https://www.oui.sncf';
    this.dbUrl = 'postgres://postgres:@localhost:5432/tgvmax';
  }
}

/**
 * Config is a singleton
 */
export default new Config();

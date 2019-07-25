/**
 * Config class
 */
export class Config {
  /**
   * oui.sncf base url
   */
  public baseUrl: string;

  constructor() {
    this.baseUrl = 'https://www.oui.sncf';
  }
}

/**
 * Config is a singleton
 */
export default new Config();

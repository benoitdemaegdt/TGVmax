import { HttpStatus } from '../Enum';

/**
 * not found error
 */
export class TooManyAlertsError extends Error {
  /**
   * error http code
   */
  public readonly code: number;

  constructor() {
    super('too many alerts');
    this.code = HttpStatus.UNPROCESSABLE_ENTITY;
  }
}

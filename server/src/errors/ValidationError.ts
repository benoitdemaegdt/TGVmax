import { HttpStatus } from '../Enum';

/**
 * validation error
 * message: 'BAD_REQUEST'
 * code: 400
 * message: 'missing required parameter "fromTime"'
 */
export class ValidationError extends Error {
  /**
   * error http code
   */
  public readonly code: number;

  constructor(message: string) {
    super(message);
    this.code = HttpStatus.BAD_REQUEST;
  }
}

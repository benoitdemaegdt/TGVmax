import { HttpStatus } from '../Enum';

/**
 * validation error
 * message: 'BAD_REQUEST'
 * code: 400
 * details: 'missing required parameter "fromTime"'
 */
export class ValidationError extends Error {
  /**
   * error http code
   */
  public readonly code: number;

  /**
   * details about the error (see example above)
   */
  public readonly detail: string;

  constructor(detail: string) {
    super();
    this.code = HttpStatus.BAD_REQUEST;
    this.detail = detail;
  }
}

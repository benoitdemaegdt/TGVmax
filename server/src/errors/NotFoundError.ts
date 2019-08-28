import { HttpStatus } from '../Enum';

/**
 * not found error
 */
export class NotFoundError extends Error {
  /**
   * error http code
   */
  public readonly code: number;

  /**
   * details about the error
   */
  public readonly detail: string;

  constructor(detail: string) {
    super();
    this.code = HttpStatus.NOT_FOUND;
    this.detail = detail;
  }
}

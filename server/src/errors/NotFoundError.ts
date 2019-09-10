import { HttpStatus } from '../Enum';

/**
 * not found error
 */
export class NotFoundError extends Error {
  /**
   * error http code
   */
  public readonly code: number;

  constructor(message: string) {
    super(message);
    this.code = HttpStatus.NOT_FOUND;
  }
}

import { HttpStatus } from '../Enum';

/**
 * not found error
 */
export class BusinessError extends Error {
  /**
   * error http code
   */
  public readonly code: number;

  constructor(message: string) {
    super(message);
    this.code = HttpStatus.UNPROCESSABLE_ENTITY;
  }
}

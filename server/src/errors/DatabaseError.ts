import { HttpStatus } from '../Enum';

/**
 * database error
 */
export class DatabaseError extends Error {
  /**
   * error http code
   */
  public readonly code: number;

  constructor(mongoErrorCode: number, message: string) {
    super(message);
    this.code = this.getErrorCode(mongoErrorCode);
  }

  /**
   * get http error code from mongo error code
   */
  private readonly getErrorCode = (mongoErrorCode: number): number => {
    /* tslint:disable */
    if (mongoErrorCode === 11000) {
      return HttpStatus.UNPROCESSABLE_ENTITY; // duplicate unique key
    } else {
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }
}

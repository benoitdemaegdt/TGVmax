import { HttpStatus } from '../Enum';

/**
 * database error
 */
export class DatabaseError extends Error {
  /**
   * error http code
   */
  public readonly code: number;

  /**
   * details about the error
   */
  public readonly detail: string;

  constructor(pgErrorCode: string, detail: string) {
    super();
    this.code = this.getErrorCode(pgErrorCode);
    this.detail = detail;
  }

  /**
   * get http error code from postgre error code
   * list of postgre error code : https://www.postgresql.org/docs/9.6/errcodes-appendix.html
   */
  private readonly getErrorCode = (pgErrorCode: string): number => {
    if (pgErrorCode === '23505') {
      return HttpStatus.UNPROCESSABLE_ENTITY; // duplicate unique key
    } else if (pgErrorCode === '23503') {
      return HttpStatus.NOT_FOUND; // link travel_alerts (user_id) <-> users (id) not found
    } else {
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }
}

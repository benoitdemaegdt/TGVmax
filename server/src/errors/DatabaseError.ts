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
    // key xxx already exists
    if (pgErrorCode === '23505') {
      return HttpStatus.UNPROCESSABLE_ENTITY;
    } else {
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }
}

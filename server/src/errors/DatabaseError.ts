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
   * error message
   */
  public readonly message: string;

  constructor(mongoErrorCode: number, mongoErrorMessage: string) {
    super();
    this.code = this.getErrorCode(mongoErrorCode);
    this.message = this.getErrorMessage(mongoErrorCode, mongoErrorMessage);
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

  /**
   * get error message that can be consumed by webapp
   * and displayed to final user
   */
  private readonly getErrorMessage = (mongoErrorCode: number, mongoErrorMessage: string): string => {
    if (mongoErrorCode === 11000) {
      if (mongoErrorMessage.includes('tgvmaxNumber')) {
        return 'Cet numéro TGVmax est déjà utilisé';
      } else if (mongoErrorMessage.includes('email')) {
        return 'Cet email est déjà utilisé';
      } else {
        return 'Oups, une erreur est survenue ...'
      }
    } else {
      return 'Oups, une erreur est survenue ...'
    }
  }
}

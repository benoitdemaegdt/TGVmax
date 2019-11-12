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

  constructor(err: Error) {
    super();
    this.code = this.getErrorCode(err);
    this.message = this.getErrorMessage(err);
  }

  /**
   * get http error code from mongo error code
   */
  private readonly getErrorCode = (err: unknown): number => {
    const mongoError: { code: number; errmsg: string } = err as { code: number; errmsg: string };
    /* tslint:disable */
    if (mongoError.code === 11000) {
      return HttpStatus.UNPROCESSABLE_ENTITY; // duplicate unique key
    } else {
      console.log(err); // unexpected error that needs to be printed
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  };

  /**
   * get error message that can be consumed by webapp
   * and displayed to final user
   */
  private readonly getErrorMessage = (err: unknown): string => {
    const mongoError: { code: number; errmsg: string } = err as { code: number; errmsg: string };

    if (mongoError.code === 11000) {
      if (mongoError.errmsg.includes('tgvmaxNumber')) {
        return 'Ce numéro TGVmax est déjà utilisé';
      } else if (mongoError.errmsg.includes('email')) {
        return 'Cet email est déjà utilisé';
      } else {
        return 'Oups, une erreur est survenue ...';
      }
    } else {
      return 'Oups, une erreur est survenue ...';
    }
  };
}

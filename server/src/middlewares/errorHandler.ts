import { Context, Middleware } from 'koa';
import { isNil } from 'lodash';
import { HttpStatus } from '../Enum';

interface IError {
  code: number;
  message: string;
}

/**
 * handle errors
 */
export function errorHandler(): Middleware {
  /**
   * return koa middleware function
   */
  return async(ctx: Context, next: Function): Promise<void> => {
    try {
      await next(); // tslint:disable-line
    } catch (err) {
      console.log(err); // tslint:disable-line
      const error: IError = err as IError;
      ctx.status = getErrorCode(error);
      ctx.body = {
        statusCode: getErrorCode(error),
        message: getErrorMessage(error),
      };
    }
  };
}

/**
 * get http error code
 */
function getErrorCode(err: IError): number {
  return !isNil(err.code) ? err.code : HttpStatus.INTERNAL_SERVER_ERROR;
}

/**
 * get error detail
 */
function getErrorMessage(err: IError): string {
  return !isNil(err.message) ? err.message : 'An unexpected error occured.';
}

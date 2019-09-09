import * as jwt from 'jsonwebtoken';
import { Context, Middleware } from 'koa';
import { isNil } from 'lodash';
import Config from '../Config';
import { CredentialError } from '../errors/CredentialError';

/**
 * authenticate protected route
 */
export function authenticate(): Middleware {
  /**
   * return koa middleware function
   */
  return async(ctx: Context, next: Function): Promise<void> => {
    const headers: {authorization?: string} = ctx.headers as {authorization?: string};
    if (isNil(headers.authorization)) {
      throw new CredentialError('authorization required');
    }

    const token: string = headers.authorization.split(' ')[1];
    try {
      jwt.verify(token, Config.jwtSecret);
    } catch (err) {
      const error: {message: string} = err as {message: string};
      throw new CredentialError(error.message);
    }
    await next(); // tslint:disable-line
  };
}

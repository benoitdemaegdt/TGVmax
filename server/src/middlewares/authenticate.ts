import * as jwt from 'jsonwebtoken';
import { Context, Middleware } from 'koa';
import { isNil } from 'lodash';
import Config from '../config';
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
      throw new CredentialError('invalid credentials');
    }
    await next(); // tslint:disable-line
  };
}

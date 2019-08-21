import * as Ajv from 'ajv';
import { Context, Middleware } from 'koa';
import { get } from 'lodash';
import { ValidationError } from '../errors/ValidationError';

/**
 * validate request format
 */
export function validate(validation: Ajv.ValidateFunction): Middleware {
  /**
   * return koa middleware function
   */
  return async(ctx: Context, next: Function): Promise<void> => {
    const body: object = ctx.request.body as object;

    const isValid: boolean = validation(body) as boolean;

    if (!isValid) {
      const errorMessage: string = get(validation, 'errors[0].message') as string;
      throw new ValidationError(errorMessage);
    }

    await next(); // tslint:disable-line
  };
}

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
      throw new ValidationError(format(errorMessage));
    }

    await next(); // tslint:disable-line
  };
}

/**
 * make error mesage understandable for user
 */
function format(message: string): string {
  switch (message) {
    case 'should NOT be shorter than 11 characters':
      return 'Le numéro TGVmax doit contenir 11 caractère';
    case 'should match pattern "^HC"':
      return 'Le numéro TGVmax doit commencer par HC';
    case 'should NOT be valid':
      return 'Les données indiquées ne sont pas valides';
    case 'should match format "email"':
      return 'L\'adresse email est invalide';
    default:
      return message;
  }
}

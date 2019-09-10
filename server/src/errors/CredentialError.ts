import { HttpStatus } from '../Enum';

/**
 * validation error
 * code: 401
 * message: 'invalid client credential'
 */
export class CredentialError extends Error {
  /**
   * error http code
   */
  public readonly code: number;

  constructor(message: string = 'email / mot de passe invalide') {
    super(message);
    this.code = HttpStatus.UNAUTHORIZED;
  }
}

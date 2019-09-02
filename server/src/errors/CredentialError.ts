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

  constructor(message: string) {
    super(message);
    this.code = HttpStatus.UNAUTHORIZED;
  }
}

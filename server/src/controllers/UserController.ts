import { QueryResult } from 'pg';
import Database from '../database/db';
import { IUser } from '../types';

/**
 * Travel controller
 */
class UserController {

  /**
   * Add a user to database
   */
  public async addUser(user: IUser): Promise<string> {
    // TODO: Bcrypt password
    const insertOp: QueryResult = await Database.insert('users', {
      email: user.email,
      password: user.password,
      tgvmax_number: user.tgvmaxNumber,
    });

    const rows: {id: string}[] = insertOp.rows as {id: string}[];

    return rows[0].id;
  }

  /**
   * delete a user from database
   */
  public async deleteUser(userId: string): Promise<QueryResult> {
    return Database.delete('users', {
      id: userId,
    });
  }
}

export default new UserController();

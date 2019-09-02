import * as bcrypt from 'bcrypt';
// import Database from '../database/db';
import { DeleteWriteOpResultObject, InsertOneWriteOpResult, ObjectId } from 'mongodb';
import Database from '../database/database';
import { IUser } from '../types';

/**
 * Travel controller
 */
class UserController {

  private readonly collectionUsers: string;

  constructor() {
    this.collectionUsers = 'users';
  }
  /**
   * Add a user to database
   */
  public async addUser(user: IUser): Promise<string> {
    const salt: number = 8;
    const insertOp: InsertOneWriteOpResult = await Database.insertOne(this.collectionUsers, {
      email: user.email,
      password: bcrypt.hashSync(user.password, salt),
      tgvmaxNumber: user.tgvmaxNumber,
    });

    return insertOp.insertedId.toString();
  }

  /**
   * delete a user from database
   */
  public async deleteUser(userId: string): Promise<DeleteWriteOpResultObject> {
    return Database.deleteOne('users', {
      _id: new ObjectId(userId),
    });
  }
}

export default new UserController();

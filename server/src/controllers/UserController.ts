import * as bcrypt from 'bcryptjs';
import { isEmpty } from 'lodash';
import { DeleteWriteOpResultObject, InsertOneWriteOpResult, ObjectId } from 'mongodb';
import Database from '../database/database';
import { CredentialError } from '../errors/CredentialError';
import { IUser } from '../types';

/**
 * Travel controller
 */
class UserController {

  /**
   * database collection name
   */
  private readonly collectionUsers: string;

  constructor() {
    this.collectionUsers = 'users';
  }

  /**
   * Add a user to database
   */
  public async addUser(user: IUser): Promise<string> {
    const SALT: number = 8;
    const insertOp: InsertOneWriteOpResult = await Database.insertOne(this.collectionUsers, {
      email: user.email,
      password: bcrypt.hashSync(user.password, bcrypt.genSaltSync(SALT)),
      tgvmaxNumber: user.tgvmaxNumber,
    });

    return insertOp.insertedId.toString();
  }

  /**
   * check user existence and credentials in database
   */
  public async checkUserCredentials(credentials: IUser): Promise<string> {
    const user: IUser[] = await Database.find<IUser>(this.collectionUsers, {
      email: credentials.email,
    });
    if (isEmpty(user) || !bcrypt.compareSync(credentials.password, user[0].password)) {
      throw new CredentialError();
    }
    const userId: ObjectId = user[0]._id as ObjectId;

    return userId.toString();
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

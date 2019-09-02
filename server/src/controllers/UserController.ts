import * as bcrypt from 'bcrypt';
import { DeleteWriteOpResultObject, InsertOneWriteOpResult, ObjectId } from 'mongodb';
import Database from '../database/database';
import { CredentialError } from '../errors/CredentialError';
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
   * check user existence and credentials in database
   */
  public async checkUserCredentials(credentials: IUser): Promise<string> {
    const user: IUser[] = await Database.find<IUser>(this.collectionUsers, {
      email: credentials.email,
    });
    const salt: number = 8;
    const hash: string = bcrypt.hashSync(credentials.password, salt);
    if (user === [] || !bcrypt.compareSync(credentials.password, hash)) {
      throw new CredentialError('invalid client credentials');
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

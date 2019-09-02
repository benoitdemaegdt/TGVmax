import { Db, DeleteWriteOpResultObject, InsertOneWriteOpResult, MongoClient } from 'mongodb';
import Config from '../config';
import { DatabaseError } from '../errors/DatabaseError';

/**
 * database logic
 */
export class Database {

  public static db: Db;

  private static client: MongoClient;

  /**
   * connect to database
   */
  public async connect(): Promise<void> {
    Database.client = await MongoClient.connect(Config.dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    Database.db = Database.client.db();
  }

  /**
   * find
   */
  public async find<T>(coll: string, query: object): Promise<T[]> {
    try {
      return await Database.db.collection(coll).find(query).toArray();
    } catch (err) {
      const error: {code: number; errmsg: string} = err as {code: number; errmsg: string};
      throw new DatabaseError(error.code, error.errmsg);
    }
  }

  /**
   * insertOne
   */
  public async insertOne(coll: string, doc: object): Promise<InsertOneWriteOpResult> {
    try {
      return await Database.db.collection(coll).insertOne(doc);
    } catch (err) {
      const error: {code: number; errmsg: string} = err as {code: number; errmsg: string};
      throw new DatabaseError(error.code, error.errmsg);
    }
  }

  /**
   * deleteOne
   */
  public async deleteOne(coll: string, query: object): Promise<DeleteWriteOpResultObject> {
    return Database.db.collection(coll).deleteOne(query);
  }

  /**
   * deleteAll
   */
  public async deleteAll(coll: string): Promise<DeleteWriteOpResultObject> {
    return Database.db.collection(coll).deleteMany({});
  }

  /**
   * close connection to database
   */
  public async disconnect(): Promise<void> {
    return Database.client.close();
  }
}

export default new Database();

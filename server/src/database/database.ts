import { Db, DeleteWriteOpResultObject, InsertOneWriteOpResult, MongoClient, UpdateWriteOpResult } from 'mongodb';
import Config from '../Config';
import { DatabaseError } from '../errors/DatabaseError';

/**
 * database logic
 */
export class Database {

  public static db: Db;

  private static client: MongoClient;

  /**
   * connect to database & ensure indexes exist
   */
  public async connect(): Promise<void> {
    Database.client = await MongoClient.connect(Config.dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    Database.db = Database.client.db();
    await Promise.all([
      Database.db.collection('users').createIndex({ email: 1 }, { unique: true }),
      Database.db.collection('users').createIndex({ tgvmaxNumber: 1 }, { unique: true }),
      Database.db.collection('stations').createIndex({ name: 1 }, { unique: true }),
    ]);
  }

  /**
   * find
   */
  public async find<T>(coll: string, query: object, projection: object = {}): Promise<T[]> {
    try {
      return await Database.db.collection(coll).find(query).project(projection).toArray();
    } catch (err) {
      throw new DatabaseError(err as Error);
    }
  }

  /**
   * findOne
   */
  public async findOne<T>(coll: string, query: object, projection: object = {}): Promise<T | null> {
    try {
      return await Database.db.collection(coll).findOne(query, { projection });
    } catch (err) {
      throw new DatabaseError(err as Error);
    }
  }

  /**
   * insertOne
   */
  public async insertOne<T>(coll: string, doc: object): Promise<InsertOneWriteOpResult<T>> {
    try {
      return await Database.db.collection(coll).insertOne(doc);
    } catch (err) {
      throw new DatabaseError(err as Error);
    }
  }

  /**
   * updateOne
   */
  public async updateOne(coll: string, query: object, update: object): Promise<UpdateWriteOpResult> {
    try {
      return await Database.db.collection(coll).updateOne(query, update);
    } catch (err) {
      throw new DatabaseError(err as Error);
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

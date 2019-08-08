import { Client, QueryResult } from 'pg';
import Config from './config';
import { ITravel } from './types';

/**
 * This class contains database logic
 */
export class Database {
  /**
   * postgre client
   */
  private readonly client: Client;

  constructor() {
    this.client = new Client({
      connectionString: Config.dbUrl,
    });
  }

  /**
   * connect to database
   */
  public async connect(): Promise<void> {
    return this.client.connect();
  }

  /**
   * close connection to database
   */
  public async disconnect(): Promise<void> {
    return this.client.end();
  }

  /**
   * insert document in table
   */
  public async insert(table: string, item: object): Promise<QueryResult> {
    const keys: string[] = Object.keys(item);
    const values: string[] = Object.values(item);
    const params: string = keys.map((_item: string, index: number) => {
      return `$${index + 1}`;
    }).join(',');

    return this.client.query({
      text: `INSERT INTO ${table}(${keys}) VALUES(${params})`,
      values,
    });
  }

  /**
   * find a travel
   * this is a specific function
   */
  public async findTravel(): Promise<ITravel[]> {
    const res: QueryResult = await this.client.query({
      text: `SELECT origin, destination, from_time, to_time, tgvmax_number, email FROM travels, users
      WHERE travels.status = $1 AND travels.user_id = users.id`,
      values: ['in_progress'],
    });

    return res.rows as ITravel[];
  }

  /**
   * delete a table
   */
  public async clear(table: string): Promise<QueryResult> {
    return this.client.query(`DELETE FROM ${table}`);
  }
}

export default new Database();

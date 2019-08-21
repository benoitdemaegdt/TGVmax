import { camelCase, mapKeys } from 'lodash';
import { Pool, PoolClient, QueryResult } from 'pg';
import Config from '../config';
import { DatabaseError } from '../errors/DatabaseError';
import { ITravel } from '../types';

/**
 * This class contains database logic
 */
export class Database {
  /**
   * postgre pool
   */
  private readonly pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: Config.dbUrl,
    });

    this.pool.on('error', () => {
      process.exit(-1);
    });
  }

  /**
   * close connection to database
   */
  public async disconnect(): Promise<void> {
    return this.pool.end();
  }

  /**
   * insert document in table
   */
  public async insert(table: string, item: object): Promise<QueryResult> {
    const keys: string[] = Object.keys(item);
    const values: string[] = Object.values(item);
    const params: string = keys.map((_key: string, index: number) => {
      return `$${index + 1}`;
    }).join(',');

    const client: PoolClient = await this.pool.connect();
    try {
      return await client.query({
        text: `INSERT INTO ${table} (${keys}) VALUES(${params}) RETURNING id`,
        values,
      });
    } catch (err) {
      const error: {code: string; detail: string} = err as {code: string; detail: string};
      throw new DatabaseError(error.code, error.detail);
    } finally {
      client.release();
    }
  }

  /**
   * find document in table
   */
  public async find<T>(table: string, query: object, project: string[] = ['*']): Promise<T[]> {
    const keys: string[] = Object.keys(query);
    const values: string[] = Object.values(query);
    const params: string = keys.map((key: string, index: number) => {
      return `${key}=$${index + 1}`;
    }).join(' and ');
    const projection: string = project.join(',');

    const client: PoolClient = await this.pool.connect();
    try {
      const res: QueryResult = await client.query({
        text: `SELECT ${projection} FROM ${table} WHERE ${params}`,
        values,
      });

      /**
       * convert Postgre to javascript naming convention
       */
      return res.rows.map((row) => { // tslint:disable-line
        return mapKeys(row, (_value: string, key: string) => {
          return camelCase(key);
        });
      }) as T[];
    } catch (err) {
      const error: {code: string; detail: string} = err as {code: string; detail: string};
      throw new DatabaseError(error.code, error.detail);
    } finally {
      client.release();
    }
  }

  /**
   * delete document
   */
  public async delete(table: string, query: object): Promise<QueryResult> {
    const keys: string[] = Object.keys(query);
    const values: string[] = Object.values(query);
    const params: string = keys.map((key: string, index: number) => {
      return `${key}=$${index + 1}`;
    }).join(' and ');

    const client: PoolClient = await this.pool.connect();
    try {
      return await client.query({
        text: `DELETE FROM ${table} WHERE ${params}`,
        values,
      });
    } catch (err) {
      const error: {code: string; detail: string} = err as {code: string; detail: string};
      throw new DatabaseError(error.code, error.detail);
    } finally {
      client.release();
    }
  }

  /**
   * find a travel
   * this is a specific function
   */
  public async findTravel(): Promise<ITravel[]> {

    const client: PoolClient = await this.pool.connect();
    try {
      const res: QueryResult = await client.query({
        text: `SELECT origin, destination, from_time, to_time, tgvmax_number, email FROM travels, users
        WHERE travels.status = $1 AND travels.user_id = users.id`,
        values: ['in_progress'],
      });

      return res.rows as ITravel[];
    } catch (err) {
      const error: {code: string; detail: string} = err as {code: string; detail: string};
      throw new DatabaseError(error.code, error.detail);
    } finally {
      client.release();
    }
  }

  /**
   * delete a table
   */
  public async clear(table: string): Promise<QueryResult> {

    const client: PoolClient = await this.pool.connect();
    try {
      return await client.query(`DELETE FROM ${table}`);
    } catch (err) {
      const error: {code: string; detail: string} = err as {code: string; detail: string};
      throw new DatabaseError(error.code, error.detail);
    } finally {
      client.release();
    }
  }
}

export default new Database();

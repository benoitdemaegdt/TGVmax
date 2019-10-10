import * as Ajv from 'ajv';
import * as jwt from 'jsonwebtoken';
import { Context } from 'koa';
import * as Router from 'koa-router';
import { isNil } from 'lodash';
import Config from '../Config';
import UserController from '../controllers/UserController';
import { HttpStatus } from '../Enum';
import { ValidationError } from '../errors/ValidationError';
import { authenticate } from '../middlewares/authenticate';
import { validate } from '../middlewares/validate';
import { userSchema } from '../schemas/userSchema';
import { IUser } from '../types';

/**
 * CRUD operations for users
 */
class UserRouter {

  /**
   * http router
   */
  public readonly router: Router;

  /**
   * schema used for request validation
   */
  private readonly userSchema: Ajv.ValidateFunction;

  constructor() {
    this.router = new Router<{}>();
    this.router.prefix('/api/v1/users');
    this.userSchema = new Ajv({allErrors: true}).compile(userSchema);
    this.init();
  }
  /**
   * Get a singlee user
   */
  private readonly getUser = async(ctx: Context): Promise<void> => {
    const params: {userId: string} = ctx.params as {userId: string};

    const user: IUser | null = await UserController.getUser(params.userId);

    if (isNil(user)) {
      ctx.status = HttpStatus.NOT_FOUND;
    } else {
      ctx.status = HttpStatus.OK;
      ctx.body = {
        email: user.email,
        tgvmaxNumber: user.tgvmaxNumber,
      };
    }
  }
  /**
   * Add a user to database
   * Log a user in
   */
  private readonly addUser = async(ctx: Context): Promise<void> => {
    const user: IUser = ctx.request.body as IUser;
    const query: {action: string} = ctx.request.query as {action: string};

    let userId: string;
    if (query.action === 'register') {
      if (isNil(user.tgvmaxNumber)) {
        throw new ValidationError('should have required property \'tgvmaxNumber\'');
      }
      userId = await UserController.addUser(user);
    } else if (query.action === 'login') {
      userId = await UserController.checkUserCredentials(user);
    } else {
      throw new ValidationError('Invalid query action');
    }

    ctx.set('Location', `${ctx.request.href}${userId}`);
    ctx.body = {
      _id: userId,
      token: jwt.sign({email: user.email}, Config.jwtSecret, { expiresIn: Config.jwtDuration }),
    };
    ctx.status = query.action === 'register' ? HttpStatus.CREATED : HttpStatus.OK;
  }

  /**
   * Delete a user from database
   */
  private readonly deleteUser = async(ctx: Context): Promise<void> => {
    const params: {userId: string} = ctx.params as {userId: string};

    await UserController.deleteUser(params.userId);

    ctx.status = HttpStatus.OK;
  }

  /**
   * init router
   */
  private init(): void {
    this.router.get('/:userId', authenticate(), this.getUser);
    this.router.post('/', validate(this.userSchema), this.addUser);
    this.router.delete('/:userId', authenticate(), this.deleteUser);
  }

}

export default new UserRouter().router;

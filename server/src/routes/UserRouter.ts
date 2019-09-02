import * as Ajv from 'ajv';
import { Context } from 'koa';
import * as Router from 'koa-router';
import UserController from '../controllers/UserController';
import { HttpStatus } from '../Enum';
import { validate } from '../middlewares/validate';
import { userSchema } from '../schemas/userSchema';
import { IUser } from '../types';

/**
 * CRUD operations for travels
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
   * Add a user to database
   */
  private readonly addUser = async(ctx: Context): Promise<void> => {
    const user: IUser = ctx.request.body as IUser;

    const userId: string = await UserController.addUser(user);

    ctx.set('Location', `${ctx.request.href}${userId}`);
    ctx.body = {
      _id: userId,
    };
    ctx.status = HttpStatus.CREATED;
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
    this.router.post('/', validate(this.userSchema), this.addUser);
    this.router.delete('/:userId', this.deleteUser);
  }

}

export default new UserRouter().router;

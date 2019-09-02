import * as Ajv from 'ajv';
import { Context } from 'koa';
import * as Router from 'koa-router';
import { isEmpty, isNil } from 'lodash';
import TravelAlertController from '../controllers/TravelAlertController';
import { HttpStatus } from '../Enum';
import { NotFoundError } from '../errors/NotFoundError';
import { validate } from '../middlewares/validate';
import { travelAlertSchema } from '../schemas/travelAlertSchema';
import { ITravelAlert } from '../types';

/**
 * CRUD operations for travels
 */
class TravelAlertRouter {

  /**
   * http router
   */
  public readonly router: Router;

  /**
   * schema used for request validation
   */
  private readonly travelAlertSchema: Ajv.ValidateFunction;

  constructor() {
    this.router = new Router<{}>();
    this.router.prefix('/api/v1/users/:userId/travels');
    this.travelAlertSchema = new Ajv({allErrors: true}).compile(travelAlertSchema);
    this.init();
  }

  /**
   * Add a travel to database
   */
  private readonly addTravel = async(ctx: Context): Promise<void> => {
    const params: { userId: string } = ctx.params as { userId: string };
    const travelAlert: ITravelAlert = ctx.request.body as ITravelAlert;

    const travelAlertId: string = await TravelAlertController.addTravelAlert(params.userId, travelAlert);

    ctx.set('Location', `${ctx.request.href}${travelAlertId}`);
    ctx.body = {
      _id: travelAlertId,
    };
    ctx.status = HttpStatus.CREATED;
  }

  /**
   * get a user's travelAlert
   */
  private readonly getTravelAlert = async(ctx: Context): Promise<void> => {
    const params: { userId: string; travelAlertId: string } = ctx.params as { userId: string; travelAlertId: string };

    const travelAlert: ITravelAlert[] = await TravelAlertController.getTravelAlert(params.userId, params.travelAlertId);

    ctx.body = travelAlert;
    ctx.status = isEmpty(travelAlert) ? HttpStatus.NOT_FOUND : HttpStatus.OK;
  }

  /**
   * get all user's travelAlert
   */
  private readonly getAllTravelAlerts = async(ctx: Context): Promise<void> => {
    const params: { userId: string } = ctx.params as { userId: string };

    const travelAlerts: ITravelAlert[] = await TravelAlertController.getAllTravelAlerts(params.userId);

    ctx.body = travelAlerts;
    ctx.status = ctx.status = isEmpty(travelAlerts) ? HttpStatus.NOT_FOUND : HttpStatus.OK;
  }

  /**
   * Delete a travel from database
   */
  private readonly deleteTravelAlert = async(ctx: Context): Promise<void> => {
    const params: { userId: string; travelAlertId: string } = ctx.params as { userId: string; travelAlertId: string };

    const nbDeleted: number | undefined =
      await TravelAlertController.deleteTravelAlert(params.userId, params.travelAlertId);

    if (isNil(nbDeleted) || nbDeleted === 0) {
      throw new NotFoundError('travelAlert not found');
    } else {
      ctx.status = HttpStatus.OK;
    }
  }

  /**
   * init router
   */
  private init(): void {
    this.router.post('/', validate(this.travelAlertSchema), this.addTravel);
    this.router.get('/', this.getAllTravelAlerts);
    this.router.get('/:travelAlertId', this.getTravelAlert);
    this.router.delete('/:travelAlertId', this.deleteTravelAlert);
  }

}

export default new TravelAlertRouter().router;

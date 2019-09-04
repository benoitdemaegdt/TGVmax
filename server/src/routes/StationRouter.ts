import { Context } from 'koa';
import * as Router from 'koa-router';
import StationController from '../controllers/StationController';
import { HttpStatus } from '../Enum';
import { authenticate } from '../middlewares/authenticate';

/**
 * Autocomplete router for train stations
 */
class StationRouter {
  /**
   * http router
   */
  public readonly router: Router;

  constructor() {
    this.router = new Router<{}>();
    this.router.prefix('/api/v1/stations');
    this.init();
  }

  /**
   * Add a travel to database
   */
  private readonly getStations = async(ctx: Context): Promise<void> => {
    const stations: string[] = await StationController.getStations();
    ctx.body = stations;
    ctx.status = HttpStatus.OK;
  }

  /**
   * init router
   */
  private init(): void {
    this.router.get('/', authenticate(), this.getStations);
  }
}
export default new StationRouter().router;

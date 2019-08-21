import * as koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as helmet from 'koa-helmet';
import * as logger from 'koa-logger';
import * as Router from 'koa-router';
import { HttpStatus } from './Enum';
import { errorHandler } from './middlewares/errorHandler';
import TravelAlertRouter from './routes/TravelAlertRouter';
import UserRouter from './routes/UserRouter';

/**
 * CRUD App
 */
class App {

  public readonly app: koa;

  constructor() {
    this.app = new koa<{}>();
    this.middleware();
    this.routes();
  }

  /**
   * add middlewares
   */
  private middleware(): void {
    if (process.env.NODE_ENV !== 'test') {
      this.app.use(logger());
    }
    this.app.use(errorHandler());
    this.app.use(helmet());
    this.app.use(bodyParser());
  }

  /**
   * add routes
   */
  private routes(): void {
    const router: Router = new Router<{}>();
    router.get('/', (ctx: koa.Context) => {
      ctx.status = HttpStatus.OK;
    });

    this.app.use(router.routes());
    this.app.use(router.allowedMethods());
    this.app.use(TravelAlertRouter.routes());
    this.app.use(TravelAlertRouter.allowedMethods());
    this.app.use(UserRouter.routes());
    this.app.use(UserRouter.allowedMethods());
  }

}

export default new App().app;

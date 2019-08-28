import App from './app';
import Config from './config';
// import UserController from './controllers/UserController';

(async(): Promise<void> => {
  /**
   * insert a user in database
   * TODO: add Login feature
   */
  // const id: string = await UserController.addUser({
  //   email: 'test@yopmail.com',
  //   password: 'fake-password',
  //   tgvmaxNumber: 'HC000054321',
  // });

  /**
   * Launch app
   */
  App.listen(Config.port);

  console.log(`App listening on port ${Config.port}`); // tslint:disable-line
  // console.log(`One user was inserted with id : ${id}`); // tslint:disable-line

})()
.catch((err: Error) => {
  console.log(err); // tslint:disable-line
});

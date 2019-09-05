import * as moment from 'moment-timezone';
import * as nodemailer from 'nodemailer';
import Config from '../config';

/**
 * Send an email when a TGVmax seat is available
 */
class Notification {

  private readonly transport: any; // tslint:disable-line

  constructor() {
    this.transport = nodemailer.createTransport({
      host: 'smtp.googlemail.com',
      port: 465,
      secure: true,
      auth: {
        user: Config.email,
        pass: Config.password,
      },
    });
  }

  /**
   * Send an email
   */
  public async sendEmail(
    to: string,
    origin: string,
    destination: string,
    date: Date,
    hours: string[],
  ): Promise<void> {
    const message: object = {
      from: Config.email,
      to,
      subject: 'Disponibilité TGVmax',
      html: `<p>Votre trajet ${origin} -> ${destination} le ${this.getHumanReadableDate(date)} est disponible en TGVmax !</p>
             <p>Départ possible à ${hours}</p>
             <p>Bon voyage !</p>`,
    };
    await this.transport.sendMail(message); // tslint:disable-line
  }

  /**
   * get human readable date from javascript date object
   */
  public getHumanReadableDate(date: Date): string {
    return moment(date).locale('fr').format('dddd DD MMMM');
  }
}

export default new Notification();

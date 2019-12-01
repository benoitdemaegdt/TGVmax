import * as chai from 'chai';
import 'mocha';
import * as moment from 'moment-timezone';
import * as nock from 'nock';
import Config from '../src/config';
import { SncfMobile } from '../src/core/SncfMobile';
import { IAvailability } from '../src/types';

describe('SncfMobile', () => {
  let fakeServer: nock.Scope;
  /**
   * Create fake server before running all tests in "Travel" section
   * This intercepts every HTTP calls to https://wshoraires.oui.sncf
   */
  before(() => {
    fakeServer = nock(Config.baseSncfMobileUrl);
  });

  /**
   * Clean all interceptors after each test
   * This avoid interceptors to interfere with each others
   */
  afterEach(() => {
    nock.cleanAll();
  });

  it('should not find any TGVmax seat available - no TGVmax', async() => {
    /**
     * init travel
     */
    const origin: string = 'FRPAR'; // fake sncfId
    const destination: string = 'FRNIT'; // fake sncfId
    const fromTime: Date = moment(new Date()).add(1, 'days').startOf('day').toDate();
    const toTime: Date = moment(fromTime).add(6, 'hours').toDate();
    const tgvmaxNumber: string = 'HC000054321';

    const sncfMobile: SncfMobile = new SncfMobile(origin, destination, fromTime, toTime, tgvmaxNumber);

    /**
     * create oui.sncf fake server
     */
    fakeServer
    .post('/m680/vmd/maq/v3/proposals/train')
    .twice()
    .reply(200, {
      journeys: [
        {
          departureDate: moment(fromTime).add(1, 'hours').tz('Europe/Paris').format('YYYY-MM-DD[T]HH:mm:ss.SSSZ'),
          arrivalDate: moment(fromTime).add(3, 'hours').tz('Europe/Paris').format('YYYY-MM-DD[T]HH:mm:ss.SSSZ'),
          departureStation: { name: 'PARIS MONTPARNASSE 1 ET 2' },
          arrivalStation: { name: 'NIORT' },
          durationInMillis: 7980000,
          price: { currency: 'EUR', value: 90 },
          segments: [ {} ],
          proposals: [ {} ],
          connections: [],
          features: [ 'TRAIN' ],
          info: {},
        },
      ],
    });

    /**
     * Test function : isTgvmaxAvailable
     * It should not return any TGVmax seat
     */
    const tgvmaxAvailability: IAvailability = await sncfMobile.isTgvmaxAvailable();
    chai.expect(tgvmaxAvailability.isTgvmaxAvailable).to.equal(false);
    chai.expect(tgvmaxAvailability.hours).to.deep.equal([]);
  });

  it('should not find any TGVmax seat available - train complet', async() => {
    /**
     * init travel
     */
    const origin: string = 'FRPAR'; // fake sncfId
    const destination: string = 'FRNIT'; // fake sncfId
    const fromTime: Date = moment(new Date()).add(1, 'days').startOf('day').toDate();
    const toTime: Date = moment(fromTime).add(6, 'hours').toDate();
    const tgvmaxNumber: string = 'HC000054321';

    const sncfMobile: SncfMobile = new SncfMobile(origin, destination, fromTime, toTime, tgvmaxNumber);

    /**
     * create oui.sncf mobile fake server
     */
    fakeServer
    .post('/m680/vmd/maq/v3/proposals/train')
    .twice()
    .reply(200, {
      journeys: [
        {
          departureDate: moment(fromTime).add(1, 'hours').tz('Europe/Paris').format('YYYY-MM-DD[T]HH:mm:ss.SSSZ'),
          arrivalDate: moment(fromTime).add(3, 'hours').tz('Europe/Paris').format('YYYY-MM-DD[T]HH:mm:ss.SSSZ'),
          departureStation: { name: 'PARIS MONTPARNASSE 1 ET 2' },
          arrivalStation: { name: 'NIORT' },
          durationInMillis: 7980000,
          segments: [ {} ],
          proposals: [ {} ],
          connections: [],
          unsellableReason: 'FULL_TRAIN',
          features: [ 'TRAIN' ],
          info: {},
        },
      ],
    });

    /**
     * Test function : isTgvmaxAvailable
     * It should not return any TGVmax seat
     */
    const tgvmaxAvailability: IAvailability = await sncfMobile.isTgvmaxAvailable();
    chai.expect(tgvmaxAvailability.isTgvmaxAvailable).to.equal(false);
    chai.expect(tgvmaxAvailability.hours).to.deep.equal([]);
  });

  it('should find exactly one TGVmax seat available', async() => {
    /**
     * init travel
     */
    const origin: string = 'FRPAR'; // fake sncfId
    const destination: string = 'FRNIT'; // fake sncfId
    const fromTime: Date = moment(new Date()).add(1, 'days').startOf('day').toDate();
    const toTime: Date = moment(fromTime).add(6, 'hours').toDate();
    const tgvmaxNumber: string = 'HC000054321';

    const sncfMobile: SncfMobile = new SncfMobile(origin, destination, fromTime, toTime, tgvmaxNumber);

    /**
     * create oui.sncf mobile fake server
     */
    fakeServer
    .post('/m680/vmd/maq/v3/proposals/train')
    .twice()
    .reply(200, {
      journeys: [
        {
          departureDate: moment(fromTime).add(1, 'hours').tz('Europe/Paris').format('YYYY-MM-DD[T]HH:mm:ss.SSSZ'),
          arrivalDate: moment(fromTime).add(3, 'hours').tz('Europe/Paris').format('YYYY-MM-DD[T]HH:mm:ss.SSSZ'),
          departureStation: { name: 'PARIS MONTPARNASSE 1 ET 2' },
          arrivalStation: { name: 'NIORT' },
          durationInMillis: 7980000,
          price: { currency: 'EUR', value: 0 },
          segments: [ {} ],
          proposals: [ {} ],
          connections: [],
          features: [ 'TRAIN' ],
          info: {},
        },
      ],
    });

    /**
     * Test function : isTgvmaxAvailable
     * It should one TGVmax seat
     */
    const tgvmaxAvailability: IAvailability = await sncfMobile.isTgvmaxAvailable();
    chai.expect(tgvmaxAvailability.isTgvmaxAvailable).to.equal(true);
    chai.expect(tgvmaxAvailability.hours).to.deep.equal([moment(fromTime).add(1, 'hours').tz('Europe/Paris').format('HH:mm')]);
  });
});

import * as chai from 'chai';
import 'mocha';
import * as moment from 'moment-timezone';
import * as nock from 'nock';
import Config from '../src/config';
import { Trainline } from '../src/core/Trainline';
import { IAvailability } from '../src/types';

describe('Trainline', () => {
  let fakeServer: nock.Scope;
  /**
   * Create fake server before running all tests in "Travel" section
   * This intercepts every HTTP calls to https://www.trainline.eu
   */
  before(() => {
    fakeServer = nock(Config.baseTrainlineUrl);
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
    const origin: string = '1'; // fake trainlineId
    const destination: string = '2'; // fake trainlineId
    const fromTime: Date = moment(new Date()).add(1, 'days').startOf('day').toDate();
    const toTime: Date = moment(fromTime).add(6, 'hours').toDate();
    const tgvmaxNumber: string = 'HC000054321';

    const trainline: Trainline = new Trainline(origin, destination, fromTime, toTime, tgvmaxNumber);

    /**
     * create trainline fake server
     */
    fakeServer
    .post('/api/v5_1/search')
    .twice()
    .reply(200, {
      trips: [
        {
          id: 'd8949e26e45311e99536b0d164a44ad6',
          arrival_date: moment(fromTime).add(2, 'hours').tz('Europe/Paris').format('YYYY-MM-DD[T]HH:mm:ss'),
          arrival_station_id: '2',
          departure_date: moment(fromTime).add(1, 'hours').tz('Europe/Paris').format('YYYY-MM-DD[T]HH:mm:ss'),
          departure_station_id: '1',
          cents: 103,
          currency: 'EUR',
          local_amount: { subunit: 103, subunit_to_unit: 100 },
          local_currency: 'EUR',
          digest: '4430840c0e40b203372e3f7bdc20af0b0948d18a',
          segment_ids: [ 'd8949c5ae45311e99c234aa6e5cf66f2' ],
          passenger_id: 'ccddfbfd-d7f5-43bf-8b64-bd92aaaf116e',
          folder_id: 'd8949f5ce45311e994d38242726611c2'
        },
      ],
    });

    /**
     * Test function : isTgvmaxAvailable
     * It should not return any TGVmax seat
     */
    const tgvmaxAvailability: IAvailability = await trainline.isTgvmaxAvailable();
    chai.expect(tgvmaxAvailability.isTgvmaxAvailable).to.equal(false);
    chai.expect(tgvmaxAvailability.hours).to.deep.equal([]);
  });

  it('should not find any TGVmax seat available - train complet', async() => {
    /**
     * init travel
     */
    const origin: string = '1'; // fake trainlineId
    const destination: string = '2'; // fake trainlineId
    const fromTime: Date = moment(new Date()).add(1, 'days').startOf('day').toDate();
    const toTime: Date = moment(fromTime).add(6, 'hours').toDate();
    const tgvmaxNumber: string = 'HC000054321';

    const trainline: Trainline = new Trainline(origin, destination, fromTime, toTime, tgvmaxNumber);

    /**
     * create trainline fake server
     */
    fakeServer
    .post('/api/v5_1/search')
    .twice()
    .reply(200, {
      trips: [
        {
          id: 'd8949e26e45311e99536b0d164a44ad6',
          arrival_date: moment(fromTime).add(2, 'hours').tz('Europe/Paris').format('YYYY-MM-DD[T]HH:mm:ss'),
          arrival_station_id: '2',
          departure_date: moment(fromTime).add(1, 'hours').tz('Europe/Paris').format('YYYY-MM-DD[T]HH:mm:ss'),
          departure_station_id: '1',
          cents: 0,
          currency: 'EUR',
          local_amount: { subunit: 0, subunit_to_unit: 100 },
          local_currency: 'EUR',
          short_unsellable_reason: 'train complet',
          digest: '4430840c0e40b203372e3f7bdc20af0b0948d18a',
          segment_ids: [ 'd8949c5ae45311e99c234aa6e5cf66f2' ],
          passenger_id: 'ccddfbfd-d7f5-43bf-8b64-bd92aaaf116e',
          folder_id: 'd8949f5ce45311e994d38242726611c2',
        },
      ],
    });

    /**
     * Test function : isTgvmaxAvailable
     * It should not return any TGVmax seat
     */
    const tgvmaxAvailability: IAvailability = await trainline.isTgvmaxAvailable();
    chai.expect(tgvmaxAvailability.isTgvmaxAvailable).to.equal(false);
    chai.expect(tgvmaxAvailability.hours).to.deep.equal([]);
  });

  it('should find exactly one TGVmax seat available', async() => {
    /**
     * init travel
     */
    const origin: string = '1'; // fake trainlineId
    const destination: string = '2'; // fake trainlineId
    const fromTime: Date = moment(new Date()).add(1, 'days').startOf('day').toDate();
    const toTime: Date = moment(fromTime).add(6, 'hours').toDate();
    const tgvmaxNumber: string = 'HC000054321';

    const trainline: Trainline = new Trainline(origin, destination, fromTime, toTime, tgvmaxNumber);
    /**
     * create trainline fake server
     */
    fakeServer
    .post('/api/v5_1/search')
    .twice()
    .reply(200, {
      trips: [
        {
          id: 'd8949e26e45311e99536b0d164a44ad6',
          arrival_date: moment(fromTime).add(2, 'hours').tz('Europe/Paris').format('YYYY-MM-DD[T]HH:mm:ss'),
          arrival_station_id: '2',
          departure_date: moment(fromTime).add(1, 'hours').tz('Europe/Paris').format('YYYY-MM-DD[T]HH:mm:ss'),
          departure_station_id: '1',
          cents: 0,
          currency: 'EUR',
          local_amount: { subunit: 0, subunit_to_unit: 100 },
          local_currency: 'EUR',
          digest: '4430840c0e40b203372e3f7bdc20af0b0948d18a',
          segment_ids: [ 'd8949c5ae45311e99c234aa6e5cf66f2' ],
          passenger_id: 'ccddfbfd-d7f5-43bf-8b64-bd92aaaf116e',
          folder_id: 'd8949f5ce45311e994d38242726611c2'
        },
      ],
    });

    /**
     * Test function : isTgvmaxAvailable
     * It should one TGVmax seat
     */
    const tgvmaxAvailability: IAvailability = await trainline.isTgvmaxAvailable();
    chai.expect(tgvmaxAvailability.isTgvmaxAvailable).to.equal(true);
    chai.expect(tgvmaxAvailability.hours).to.deep.equal([moment(fromTime).add(1, 'hours').tz('Europe/Paris').format('HH:mm')]);
  });
});

import * as chai from 'chai';
import 'mocha';
import * as moment from 'moment';
import * as nock from 'nock';
import Config from '../src/config';
import { Travel } from '../src/travel';
import { IAvailability } from '../src/types';

describe('Travel', () => {
  let fakeServer: nock.Scope;
  /**
   * Create fake server before running all tests in "Travel" section
   */
  before(() => {
    fakeServer = nock(Config.baseUrl);
  });

  /**
   * Clear fake server after running all tests in "Travel" section
   */
  after(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('should not find any TGVmax seat available', async() => {
    /**
     * init travel
     */
    const origin: string = 'FRPAR';
    const destination: string = 'FRLYS';
    const fromTime: string = moment(new Date()).add(1, 'days').startOf('day').toISOString();
    const toTime: string = moment(fromTime).add(6, 'hours').toISOString();
    const tgvmaxNumber: string = 'HC000054321';
    const travel: Travel = new Travel(origin, destination, fromTime, toTime, tgvmaxNumber);

    /**
     * create oui.sncf fake server
     */
    fakeServer
    .post('/proposition/rest/travels/outward/train/next')
    .twice()
    .reply(200, {
      wishId: '5d3ad4b28a05e00d5115f990',
      fares: [],
      travelProposals: [
        {
          id: '9f1b817d-5cb0-4cf5-b50d-9741c1a09bb0',
          segments: [],
          firstClassOffers: [],
          secondClassOffers: [],
          travelType: 'NORMAL',
          doorToDoor: {},
          origin: {},
          destination: {},
          departureDate: moment(fromTime).add(4, 'hours').toISOString(),
          arrivalDate: moment(fromTime).add(5, 'hours').toISOString(),
          minPrice: 90,
        },
      ],
    });

    /**
     * Test function : isTgvmaxAvailable
     * It should not return an TGVmax seat
     */
    const tgvmaxAvailability: IAvailability = await travel.isTgvmaxAvailable();
    chai.expect(tgvmaxAvailability.isTgvmaxAvailable).to.equal(false);
    chai.expect(tgvmaxAvailability.hours).to.deep.equal([]);
  });

  it('should find exactly one TGVmax seat available', async() => {
    /**
     * init travel
     */
    const origin: string = 'FRPAR';
    const destination: string = 'FRLYS';
    const fromTime: string = moment(new Date()).add(1, 'days').startOf('day').toISOString();
    const toTime: string = moment(fromTime).add(6, 'hours').toISOString();
    const tgvmaxNumber: string = 'HC000054321';
    const travel: Travel = new Travel(origin, destination, fromTime, toTime, tgvmaxNumber);

    /**
     * create oui.sncf fake server
     */
    fakeServer
    .post('/proposition/rest/travels/outward/train/next')
    .twice()
    .reply(200, {
      wishId: '5d3ad4b28a05e00d5115f990',
      fares: [],
      travelProposals: [
        {
          id: '9f1b817d-5cb0-4cf5-b50d-9741c1a09bb0',
          segments: [],
          firstClassOffers: [],
          secondClassOffers: [],
          travelType: 'NORMAL',
          doorToDoor: {},
          origin: {},
          destination: {},
          departureDate: moment(fromTime).add(4, 'hours').toISOString(),
          arrivalDate: moment(fromTime).add(5, 'hours').toISOString(),
          minPrice: 0,
        },
      ],
    });

    /**
     * Test function : isTgvmaxAvailable
     * It should one TGVmax seat
     */
    const tgvmaxAvailability: IAvailability = await travel.isTgvmaxAvailable();
    chai.expect(tgvmaxAvailability.isTgvmaxAvailable).to.equal(true);
    chai.expect(tgvmaxAvailability.hours).to.deep.equal([moment(fromTime).add(4, 'hours').format('HH:mm')]);
  });

  it('should find exactly six TGVmax seats available', async() => {
    /**
     * init travel
     */
    const origin: string = 'FRPAR';
    const destination: string = 'FRLYS';
    const fromTime: string = moment(new Date()).add(1, 'days').startOf('day').toISOString();
    const toTime: string = moment(fromTime).add(10, 'hours').toISOString();
    const tgvmaxNumber: string = 'HC000054321';
    const travel: Travel = new Travel(origin, destination, fromTime, toTime, tgvmaxNumber);

    /**
     * create oui.sncf fake server
     */
    fakeServer
    .post('/proposition/rest/travels/outward/train/next')
    .reply(200, {
      wishId: '5d3ad4b28a05e00d5115f990',
      fares: [],
      travelProposals: [
        {
          id: '9f1b817d-5cb0-4cf5-b50d-9741c1a09bb0',
          departureDate: moment(fromTime).add(1, 'hours').toISOString(),
          arrivalDate: moment(fromTime).add(2, 'hours').toISOString(),
          minPrice: 0,
        },
        {
          id: '9f1b817d-5cb0-4cf5-b50d-9741c1a09bb1',
          departureDate: moment(fromTime).add(2, 'hours').toISOString(),
          arrivalDate: moment(fromTime).add(3, 'hours').toISOString(),
          minPrice: 90,
        },
        {
          id: '9f1b817d-5cb0-4cf5-b50d-9741c1a09bb2',
          departureDate: moment(fromTime).add(3, 'hours').toISOString(),
          arrivalDate: moment(fromTime).add(4, 'hours').toISOString(),
          minPrice: 0,
        },
        {
          id: '9f1b817d-5cb0-4cf5-b50d-9741c1a09bb3',
          departureDate: moment(fromTime).add(4, 'hours').toISOString(),
          arrivalDate: moment(fromTime).add(5, 'hours').toISOString(),
          minPrice: 60,
        },
        {
          id: '9f1b817d-5cb0-4cf5-b50d-9741c1a09bb4',
          departureDate: moment(fromTime).add(5, 'hours').toISOString(),
          arrivalDate: moment(fromTime).add(6, 'hours').toISOString(),
          minPrice: 30,
        },
      ],
    })
    .post('/proposition/rest/travels/outward/train/next')
    .reply(200, {
      wishId: '5d3ad4b28a05e00d5115f990',
      fares: [],
      travelProposals: [
        {
          id: '9f1b817d-5cb0-4cf5-b50d-9741c1a09bb4',
          departureDate: moment(fromTime).add(5, 'hours').toISOString(),
          arrivalDate: moment(fromTime).add(6, 'hours').toISOString(),
          minPrice: 30,
        },
      ],
    });

    /**
     * Test function : isTgvmaxAvailable
     * It should two TGVmax seats
     */
    const tgvmaxAvailability: IAvailability = await travel.isTgvmaxAvailable();
    chai.expect(tgvmaxAvailability.isTgvmaxAvailable).to.equal(true);
    chai.expect(tgvmaxAvailability.hours).to.deep.equal([
      moment(fromTime).add(1, 'hours').format('HH:mm'),
      moment(fromTime).add(3, 'hours').format('HH:mm'),
    ]);
  });
});

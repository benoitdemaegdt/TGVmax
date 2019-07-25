import { Travel } from './travel';
import { IAvailability } from './types';

/**
 * step 1 : instantiate your travel
 * Note that you can find few train station code in data/trainStations.json
 */
const travel: Travel = new Travel('<ORIGIN_CODE>', '<DESTINATION_CODE>', '<FROM_DATE>', '<TO_DATE>', '<TGVMAX_NUMBER>');
// example :
// const travel: Travel = new Travel('FRPAR', 'FRNIT', '2019-07-31T05:00:00', '2019-07-31T15:23:00', 'HC000054321');

/**
 * step 2 : get min price of all trains of the day
 */
(async(): Promise<void> => {
  const a: IAvailability = await travel.isTgvmaxAvailable();
  console.log(a); // tslint:disable-line
})()
.catch((err: Error) => {
  console.log(err); // tslint:disable-line
});

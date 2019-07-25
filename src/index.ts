import { Travel } from './travel';
import { ITrain } from './types';

/**
 * step 1 : instantiate your travel
 * Note that you can find few train station code in data/trainStations.json
 */
const travel: Travel = new Travel('<ORIGIN_CODE>', '<DESTINATION_CODE>', '<DATE>', '<TGVMAX_NUMBER>');
// example :
// const travel: Travel = new Travel('FRPAR', 'FRLYS', '2019-07-30T05:00:00', 'HC000054321');

/**
 * step 2 : get min price of all trains of the day
 */
(async(): Promise<void> => {
  const a: ITrain[] = await travel.getAllMinPrices();
  console.log(a); // tslint:disable-line
})()
.catch((err: Error) => {
  console.log(err); // tslint:disable-line
});

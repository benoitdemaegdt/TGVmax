import { convertToDatePickerFormat, getFrenchDate, getHour, getISOString } from '../src/helper/date';

describe('Date', () => {
  it('getFrenchDate - should return proper french date (isostring)', () => {
    const input: string = '2019-09-09T06:55:00Z';
    expect(getFrenchDate(input)).toBe('lundi 9 septembre');
  });

  it('getFrenchDate - should return proper french date (yyyy-mm-dd)', () => {
    const input: string = '2019-09-10';
    expect(getFrenchDate(input)).toBe('mardi 10 septembre');
  });

  it('getFrenchDate - should return proper french date (sunday)', () => {
    const input: string = '2019-09-15';
    expect(getFrenchDate(input)).toBe('dimanche 15 septembre');
  });

  it('getHour - should return proper hour (UTC+2 - summer time)', () => {
    const input: string = '2019-09-10T06:55:00Z';
    expect(getHour(input)).toBe('08:55');
  });

  it('getHour - should return proper hour (UTC+1 - winter time)', () => {
    const input: string = '2019-10-29T06:55:00Z';
    expect(getHour(input)).toBe('07:55');
  });

  it('convertToDatePickerFormat - should return proper v-datepicker format', () => {
    const input: Date = new Date('2019-10-29T06:55:00Z');
    expect(convertToDatePickerFormat(input)).toBe('2019-10-29');
  });

  it('getISOString - should return proper isostring (summer time)', () => {
    const date: string = '2019-08-27';
    const time: string = '22h15';
    expect(getISOString(date, time)).toBe('2019-08-27T20:15:00.000Z');
  });

  it('getISOString - should return proper isostring (winter time)', () => {
    const date: string = '2019-10-29';
    const time: string = '22h15';
    expect(getISOString(date, time)).toBe('2019-10-29T21:15:00.000Z');
  });
});

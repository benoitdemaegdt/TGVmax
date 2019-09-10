/**
 * convert date to human date
 * input : 2019-09-10T06:55:00Z | 2019-09-10
 * output: mardi 10 septembre
 */
export function getFrenchDate(date: string): string | undefined {
  if (!date) {
    return;
  }
  const [year, month, day]: string[] = date.split('T')[0].split('-');
  const jsDate = new Date(Number(year), Number(month) - 1, Number(day));
  return `${getFrenchDay(jsDate.getDay())} ${jsDate.getDate()} ${getFrenchMonth(jsDate.getMonth())}`;
}

/**
 * get hour from isodate
 * input : 2019-09-10T06:55:00Z
 * output: 06h55
 */
export function getHour(isodate: string): string {
  const date = new Date(isodate);
  const hour = `0${date.getHours()}`.slice(-2);
  const min = `0${date.getMinutes()}`.slice(-2);
  return `${hour}:${min}`;
}

/**
 * convert js date to vuetify datepicker format
 * input: Tue Aug 27 2019 16:55:46 GMT+0200 (Central European Summer Time)
 * output: 2019-08-27
 */
export function convertToDatePickerFormat(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * convert to isostring. Takes timezone into account.
 * inputs: '2019-08-27', '22h15'
 * output: 2019-08-27T20:15:00Z'
 */
export function getISOString(date: string, time: string) {
  const [year, month, day]: string[] = date.split('T')[0].split('-');
  const [hour, min]: string[] = time.split('h');
  const jsDate: Date = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(min));
  return jsDate.toISOString();
}

/**
 * convert the nth day of the week to the actual french name
 */
function getFrenchDay(dayNumber: number) {
  switch (dayNumber) {
    case 1:
      return 'lundi';
    case 2:
      return 'mardi';
    case 3:
      return 'mercredi';
    case 4:
      return 'jeudi';
    case 5:
      return 'vendredi';
    case 6:
      return 'samedi';
    case 7:
      return 'dimanche';
  }
}

/**
 * convert the nth month to the actual french name
 * !! starts at 0 !!
 */
function getFrenchMonth(monthNumber: number) {
  switch (monthNumber) {
    case 0:
      return 'janvier';
    case 1:
      return 'février';
    case 2:
      return 'mars';
    case 3:
      return 'avril';
    case 4:
      return 'mai';
    case 5:
      return 'juin';
    case 6:
      return 'juillet';
    case 7:
      return 'août';
    case 8:
      return 'septembre';
    case 9:
      return 'octobre';
    case 10:
      return 'novembre';
    case 11:
      return 'décembre';
  }
}

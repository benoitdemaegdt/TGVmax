/**
 * Train interface
 */
export interface ITrain {
  departureDate: string;
  arrivalDate: string;
  minPrice: number;
}

/**
 * Availability interface
 */
export interface IAvailability {
  isTgvmaxAvailable: boolean;
  hours: string[];
}

/**
 * Travel interface (PostGre)
 */
export interface ITravel {
  origin: string;
  destination: string;
  from_time: Date;
  to_time: Date;
  tgvmax_number: string;
  email: Date;
}

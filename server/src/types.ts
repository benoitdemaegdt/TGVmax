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

/**
 * User interface
 */
export interface IUser {
  email: string;
  password: string;
  tgvmaxNumber: string;
}

/**
 * TravelAlert interface
 */
export interface ITravelAlert {
  id: string;
  userId: string;
  origin: string;
  destination: string;
  fromTime: string;
  toTime: string;
  status: string;
  lastCheck: string;
  createdAt: string;
}

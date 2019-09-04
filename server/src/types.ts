import { ObjectId } from 'mongodb';

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
 * User interface
 */
export interface IUser {
  _id?: ObjectId;
  email: string;
  password: string;
  tgvmaxNumber?: string;
}

/**
 * TravelAlert interface
 */
export interface ITravelAlert {
  _id?: string;
  userId: string;
  origin: string;
  destination: string;
  fromTime: string;
  toTime: string;
  status: string;
  lastCheck: string;
  createdAt: string;
}

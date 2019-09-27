import { ObjectId } from 'mongodb';

/**
 * SNCF Train interface
 */
export interface ITrain {
  departureDate: string;
  arrivalDate: string;
  minPrice: number;
}

/**
 * Trainline Train interface
 */
export interface ITrainlineTrain {
  id?: string;
  arrival_date?: string;
  arrival_station_id?: string;
  departure_date: string;
  departure_station_id?: string;
  cents?: number;
  currency?: string;
  local_amount?: {
    subunit: number;
    subunit_to_unit: number;
  };
  local_currency?: string;
  digest?: string;
  segment_ids?: string[];
  passenger_id?: string;
  folder_id?: string;
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
  tgvmaxNumber: string;
  origin: {
    name: string;
    sncfId: string;
    trainlineId: string;
  };
  destination: {
    name: string;
    sncfId: string;
    trainlineId: string;
  };
  fromTime: Date;
  toTime: Date;
  status: string;
  lastCheck: string;
  createdAt: string;
}

/**
 * Train station interface
 */
export interface IStation {
  _id?: string;
  name: string;
  sncfId: string;
  trainlineId: string;
}

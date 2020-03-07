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
 * SncfMobile Train interface
 */
export interface ISncfMobileTrain {
  departureDate: string;
  arrivalDate: string;
  departureStation: {
    name: string;
  };
  arrivalStation: {
    name: string;
  };
  durationInMillis: number;
  price: {
    currency: string;
    value: number;
  };
  segments: object[];
  proposals: object[][];
  connections: string[];
  features: string[];
  info: object;
  unsellableReason?: string;
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
  _id: ObjectId;
  email: string;
  password: string;
  tgvmaxNumber: string;
}

/**
 * TravelAlert interface
 */
export interface ITravelAlert {
  _id: ObjectId;
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
  lastCheck: Date;
  createdAt: Date;
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

export interface IConnector {
  name: string;
  isTgvmaxAvailable: any; // tslint:disable-line
  weight: number;
}

export interface IConnectorParams {
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
  fromTime: string;
  toTime: string;
  tgvmaxNumber: string;
}

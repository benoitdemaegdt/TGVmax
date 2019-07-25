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

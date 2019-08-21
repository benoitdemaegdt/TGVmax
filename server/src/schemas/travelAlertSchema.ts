export const travelAlertSchema: object = {
  properties: {
    origin: {
      type: 'string',
    },
    destination: {
      type: 'string',
    },
    fromTime: {
      type: 'string',
      format: 'date-time',
    },
    toTime: {
      type: 'string',
      format: 'date-time',
    },
  },
  required: ['origin', 'destination', 'fromTime', 'toTime'],
};

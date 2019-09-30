export const travelAlertSchema: object = {
  properties: {
    origin: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        sncfId: { type: 'string' },
        trainlineId: { type: 'string' },
      },
      required: ['name', 'sncfId', 'trainlineId'],
      additionalProperties: false,
    },
    destination: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        sncfId: { type: 'string' },
        trainlineId: { type: 'string' },
      },
      required: ['name', 'sncfId', 'trainlineId'],
      additionalProperties: false,
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
  additionalProperties: false,
};

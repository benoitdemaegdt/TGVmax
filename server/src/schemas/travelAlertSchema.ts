export const travelAlertSchema: object = {
  properties: {
    origin: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        code: { type: 'string' },
      },
      required: ['name', 'code'],
      additionalProperties: false,
    },
    destination: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        code: { type: 'string' },
      },
      required: ['name', 'code'],
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

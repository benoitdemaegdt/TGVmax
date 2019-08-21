export const userSchema: object = {
  properties: {
    email: {
      type: 'string',
      minLength: 5,
    },
    password: {
      type: 'string',
      minLength: 8,
    },
    tgvmaxNumber: {
      type: 'string',
      minLength: 11,
      maxLength: 11,
    },
  },
  required: ['email', 'password', 'tgvmaxNumber'],
  additionalProperties: false,
};

export const userSchema: object = {
  properties: {
    email: {
      type: 'string',
      minLength: 5,
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 8,
    },
    tgvmaxNumber: {
      type: 'string',
      minLength: 11,
      maxLength: 11,
      pattern: '^HC',
    },
  },
  required: ['email', 'password'],
  additionalProperties: false,
};

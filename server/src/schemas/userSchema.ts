export const userSchema: object = {
  properties: {
    email: {
      type: 'string',
      minLength: 5,
      format: 'email',
      not: {
        pattern: 'yopmail',
      },
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
      not: {
        pattern: 'HC([0-9])\\1{8}', // avoid HC555555555
      },
    },
  },
  required: ['email', 'password'],
  additionalProperties: false,
};

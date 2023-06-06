const envSchema = require('env-schema')

module.exports = envSchema({
  dotenv: true,
  schema: {
    type: 'object',
    required: ['PGHOST', 'PGPORT', 'PGDATABASE', 'PGUSER', 'PGPASSWORD'],
    properties: {
      PGHOST: {
        type: 'string',
      },
      PGPORT: {
        type: 'number',
      },
      PGDATABASE: {
        type: 'string',
      },
      PGUSER: {
        type: 'string',
      },
      PGPASSWORD: {
        type: 'string',
      },
      APP_HOST: {
        type: 'string',
        default: '127.0.0.1',
      },
      APP_PORT: {
        type: 'number',
        default: 3000,
      },
      APP_LOGGER_LEVEL: {
        type: 'string',
        default: 'info',
      },
    },
  },
})

const app = require('../src/app')

module.exports = async function (t) {
  const server = await app({
    APP_HOST: '127.0.0.1',
    APP_PORT: 3000,
    APP_LOGGER_LEVEL: 'silent',
  })

  t.teardown(server.close.bind(server))

  return server
}

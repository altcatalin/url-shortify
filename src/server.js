const closeWithGrace = require('close-with-grace')

const app = require('./app')
const config = require('./config')

;(async () => {
  const server = await app(config)

  try {
    await server.listen({
      host: config.APP_HOST,
      port: config.APP_PORT,
    })

    closeWithGrace(async () => {
      await server.close()
    })
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
})()

const fastify = require('fastify')
const fastifySensible = require('@fastify/sensible')
const fastifyHelmet = require('@fastify/helmet')
const fastifyPostgres = require('@fastify/postgres')
const fastifySwagger = require('@fastify/swagger')
const fastifySwaggerUI = require('@fastify/swagger-ui')
const Hashids = require('hashids/cjs')

const schemas = require('./schemas')
const packageJSON = require('../package.json')

module.exports = async function (config = {}) {
  const app = fastify({
    logger: {
      level: config.APP_LOGGER_LEVEL,
    },
    trustProxy: config.APP_TRUST_PROXY,
    requestIdHeader: config.APP_REQUEST_ID_HEADER,
  })

  app.decorate('config', config)
  app.decorate('utils', {
    hashids: new Hashids(packageJSON.name, 6),
    serverUrl: `${config.APP_HTTPS ? 'https' : 'http'}://${
      config.APP_DOMAIN ? config.APP_DOMAIN : `${config.APP_HOST}:${config.APP_PORT}`
    }`,
  })

  app.register(fastifySensible)
  app.register(fastifyHelmet)
  app.register(fastifyPostgres)

  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: packageJSON.name,
        description: packageJSON.description,
        version: packageJSON.version,
      },
      servers: [
        {
          url: app.utils.serverUrl,
        },
      ],
    },
    hideUntagged: true,
    exposeRoute: true,
  })

  app.register(fastifySwaggerUI, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
    uiHooks: {
      onRequest: function (request, reply, next) {
        next()
      },
      preHandler: function (request, reply, next) {
        next()
      },
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject) => {
      return swaggerObject
    },
    transformSpecificationClone: true,
  })

  app.get('/health', { schema: schemas.getHealth }, async function (request, reply) {
    reply.preventCache()
    await app.pg.query('SELECT NOW()')

    return {}
  })

  app.get('/urls', { schema: schemas.getUrls }, async function (request) {
    const result = await app.pg.query('SELECT * FROM urls LIMIT 50 OFFSET $1', [request.query.offset])

    return {
      urls: result.rows.map((row) => {
        return {
          id: row.hash_id,
          shortUrl: `${app.utils.serverUrl}/${row.hash_id}`,
          targetUrl: row.url,
        }
      }),
    }
  })

  app.post('/urls', { schema: schemas.postUrl }, async function (request) {
    const result = await app.pg.query('INSERT INTO urls(url) VALUES($1) RETURNING *', [request.body.targetUrl])
    const hashId = app.utils.hashids.encode(result.rows[0].id)
    await app.pg.query('UPDATE urls set hash_id = $1 WHERE id = $2', [hashId, result.rows[0].id])

    return {
      id: hashId,
      shortUrl: `${app.utils.serverUrl}/${hashId}`,
      targetUrl: result.rows[0].url,
    }
  })

  app.get('/urls/:id', { schema: schemas.getUrl }, async function (request, reply) {
    const id = app.utils.hashids.decode(request.params.id)[0]
    const result = await app.pg.query('SELECT * FROM urls WHERE id = $1', [id])

    if (result.rows.length === 0) {
      return reply.notFound()
    }

    return {
      id: result.rows[0].hash_id,
      shortUrl: `${app.utils.serverUrl}/${result.rows[0].hash_id}`,
      targetUrl: result.rows[0].url,
    }
  })

  app.delete('/urls/:id', { schema: schemas.deleteUrl }, async function (request, reply) {
    const id = app.utils.hashids.decode(request.params.id)[0]
    const result = await app.pg.query('SELECT * FROM urls WHERE id = $1', [id])

    if (result.rows.length === 0) {
      return reply.notFound()
    }

    await app.pg.query('DELETE FROM urls WHERE id = $1', [id])

    return {}
  })

  app.get('/:id', { schema: schemas.redirectUrl }, async function (request, reply) {
    const id = app.utils.hashids.decode(request.params.id)[0]
    const result = await app.pg.query('SELECT * FROM urls WHERE id = $1', [id])

    if (result.rows.length === 0) {
      return reply.notFound()
    }

    return reply.redirect(301, result.rows[0].url)
  })

  app.get('/', async function (request, reply) {
    return reply.redirect(302, '/docs')
  })

  await app.ready()
  app.swagger()

  return app
}

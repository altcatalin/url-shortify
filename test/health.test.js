const { test } = require('tap')
const pgmock2 = require('pgmock2')
const helper = require('./helper')

test('health route', async (t) => {
  const pg = new pgmock2.default()

  pg.add('SELECT NOW()', [], {
    rowCount: 1,
    rows: [{ now: '2023-05-10T14:19:38.979Z' }],
  })

  const server = await helper(t)
  server.pg = pg

  const res = await server.inject({
    url: '/health',
  })

  t.same(res.statusCode, 200)
  t.same(res.headers['cache-control'], 'no-store, max-age=0, private')
  t.same(res.headers['expires'], 0)
})

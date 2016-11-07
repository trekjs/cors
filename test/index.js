import test from 'ava'
import request from 'request-promise'
import Engine from 'trek-engine'
import cors from '..'

const listen = app => {
  return new Promise((resolve, reject) => {
    app.run(function (err) {
      if (err) {
        return reject(err)
      }
      const { port } = this.address()
      resolve(`http://localhost:${port}`)
    })
  })
}

test('should not set `Access-Control-Allow-Origin` when request Origin header missing', async t => {
  const app = new Engine()

  app.use(cors())

  app.use(async ({ res }) => {
    res.send(200, { foo: 'bar' })
  })

  const url = await listen(app)
  const res = await request({
    url,
    json: true,
    simple: false,
    resolveWithFullResponse: true
  })

  t.deepEqual(res.body, { foo: 'bar' })
  t.is(res.statusCode, 200)
  t.is(res.headers['access-control-allow-origin'], undefined)
})

test('should set `Access-Control-Allow-Origin` to `*` when request Origin is empty', async t => {
  const app = new Engine()

  app.use(cors())

  app.use(async ({ res }) => {
    res.send(200, { foo: 'bar' })
  })

  const url = await listen(app)
  const res = await request({
    url,
    json: true,
    simple: false,
    resolveWithFullResponse: true,
    headers: {
      Origin: ''
    }
  })

  t.deepEqual(res.body, { foo: 'bar' })
  t.is(res.statusCode, 200)
  t.is(res.headers['access-control-allow-origin'], '*')
})

test('should set `Access-Control-Allow-Origin` to `*` when request Origin is wildcard', async t => {
  const app = new Engine()

  app.use(cors({
    credentials: true,
    exposeHeaders: ['content-length']
  }))

  app.use(async ({ res }) => {
    res.send(200, { foo: 'bar' })
  })

  const url = await listen(app)
  const res = await request({
    url,
    json: true,
    simple: false,
    resolveWithFullResponse: true,
    headers: {
      Origin: 'https://trekjs.com'
    }
  })

  t.deepEqual(res.body, { foo: 'bar' })
  t.is(res.statusCode, 200)
  t.is(res.headers['access-control-allow-origin'], '*')
  t.is(res.headers['access-control-allow-credentials'], 'true')
  t.is(res.headers['access-control-expose-headers'], 'content-length')
})

test('should set 204 when preflight request', async t => {
  const app = new Engine()

  app.use(cors({
    credentials: true,
    origins: ['https://trekjs.com'],
    maxAge: 3600,
    methods: ['GET', 'POST']
  }))

  app.use(async ({ res }) => {
    res.send(200, { foo: 'bar' })
  })

  const url = await listen(app)
  const res = await request({
    method: 'OPTIONS',
    url,
    json: true,
    simple: false,
    resolveWithFullResponse: true,
    headers: {
      Origin: 'https://trekjs.com',
      'Access-Control-Request-Method': 'PUT',
      'Access-Control-Request-Headers': 'X-PINGOTHER, Content-Type'
    }
  })

  t.is(res.body, undefined)
  t.is(res.statusCode, 204)
  t.is(res.headers['access-control-max-age'], '3600')
  t.is(res.headers['access-control-allow-credentials'], 'true')
  t.is(res.headers['access-control-allow-origin'], 'https://trekjs.com')
  t.is(res.headers['access-control-allow-methods'], 'GET,POST')
  t.is(res.headers['access-control-allow-headers'], 'X-PINGOTHER, Content-Type')
})

test('should set 204 when preflight request and add headers option', async t => {
  const app = new Engine()

  app.use(cors({
    credentials: true,
    origins: ['https://trekjs.com'],
    maxAge: 3600,
    methods: ['GET', 'POST'],
    headers: ['X-PINGOTHER', 'Content-Type']
  }))

  app.use(async ({ res }) => {
    res.send(200, { foo: 'bar' })
  })

  const url = await listen(app)
  const res = await request({
    method: 'OPTIONS',
    url,
    json: true,
    simple: false,
    resolveWithFullResponse: true,
    headers: {
      Origin: 'https://trekjs.com',
      'Access-Control-Request-Method': 'PUT'
    }
  })

  t.is(res.body, undefined)
  t.is(res.statusCode, 204)
  t.is(res.headers['access-control-max-age'], '3600')
  t.is(res.headers['access-control-allow-credentials'], 'true')
  t.is(res.headers['access-control-allow-origin'], 'https://trekjs.com')
  t.is(res.headers['access-control-allow-methods'], 'GET,POST')
  t.is(res.headers['access-control-allow-headers'], 'X-PINGOTHER,Content-Type')
})

test('should not set 204 when preflight request and origin is empty', async t => {
  const app = new Engine()

  app.use(cors({
    origins: ''
  }))

  app.use(async ({ res }) => {
    res.send(200, { foo: 'bar' })
  })

  const url = await listen(app)
  const res = await request({
    method: 'OPTIONS',
    url,
    json: true,
    simple: false,
    resolveWithFullResponse: true,
    headers: {
      Origin: 'https://trekjs.com',
      'Access-Control-Request-Method': 'PUT'
    }
  })

  t.deepEqual(res.body, { foo: 'bar' })
  t.is(res.statusCode, 200)
  t.is(res.headers.vary, 'Origin, Access-Control-Request-Method, Access-Control-Request-Headers')
})

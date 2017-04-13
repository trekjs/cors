# cors

Cross-Origin Resource Sharing(CORS) middleware


## Installation

```
$ npm install trek-cors --save
```


## Examples

```js
'use strict'

const Engine = require('trek-engine')
const sessions = require('trek-sessions')
const bodyParser = require('trek-body-parser')
const cors = require('trek-cors')

async function start () {
  const app = new Engine()

  app.use(sessions())

  app.use(bodyParser())

  app.use(cors())

  app.use(ctx => {
    ctx.res.body = 'Hello CORS'
  })

  app.on('error', (err, ctx) => {
    console.log(err)
  })

  app.run(3000)
}

start().catch(console.log)
```


## API

```js
csrf({
  credentials: false,
  origins: '*',
  methods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  maxAge: 0
})
```


## Badges

[![Build Status](https://travis-ci.org/trekjs/cors.svg?branch=master)](https://travis-ci.org/trekjs/cors)
[![codecov](https://codecov.io/gh/trekjs/cors/branch/master/graph/badge.svg)](https://codecov.io/gh/trekjs/cors)
![](https://img.shields.io/badge/license-MIT-blue.svg)

---

> [fundon.me](https://fundon.me) &nbsp;&middot;&nbsp;
> GitHub [@fundon](https://github.com/fundon) &nbsp;&middot;&nbsp;
> Twitter [@_fundon](https://twitter.com/_fundon)

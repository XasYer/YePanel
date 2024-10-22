'use strict'

const { test } = require('tap')
const http = require('node:http')
const path = require('node:path')
const request = require('supertest')
const { readdir } = require('node:fs/promises')
const send = require('../lib/send').send

const fixtures = path.join(__dirname, 'fixtures')

test('send(file)', function (t) {
  t.plan(5)

  t.test('file type', function (t) {
    t.plan(6)

    const app = http.createServer(async function (req, res) {
      const { statusCode, headers, stream, type, metadata } = await send(req, req.url, { root: fixtures })
      t.equal(type, 'file')
      t.ok(metadata.path)
      t.ok(metadata.stat)
      t.notOk(metadata.error)
      t.notOk(metadata.requestPath)
      res.writeHead(statusCode, headers)
      stream.pipe(res)
    })

    request(app)
      .get('/name.txt')
      .expect('Content-Length', '4')
      .expect(200, 'tobi', err => t.error(err))
  })

  t.test('directory type', function (t) {
    t.plan(6)

    const app = http.createServer(async function (req, res) {
      const { statusCode, headers, stream, type, metadata } = await send(req, req.url, { root: fixtures })
      t.equal(type, 'directory')
      t.ok(metadata.path)
      t.notOk(metadata.stat)
      t.notOk(metadata.error)
      t.ok(metadata.requestPath)
      res.writeHead(statusCode, headers)
      stream.pipe(res)
    })

    request(app)
      .get('/pets')
      .expect('Location', '/pets/')
      .expect(301, err => t.error(err))
  })

  t.test('error type', function (t) {
    t.plan(6)

    const app = http.createServer(async function (req, res) {
      const { statusCode, headers, stream, type, metadata } = await send(req, req.url, { root: fixtures })
      t.equal(type, 'error')
      t.notOk(metadata.path)
      t.notOk(metadata.stat)
      t.ok(metadata.error)
      t.notOk(metadata.requestPath)
      res.writeHead(statusCode, headers)
      stream.pipe(res)
    })

    const path = Array(100).join('foobar')
    request(app)
      .get('/' + path)
      .expect(404, err => t.error(err))
  })

  t.test('custom directory index view', function (t) {
    t.plan(1)

    const app = http.createServer(async function (req, res) {
      const { statusCode, headers, stream, type, metadata } = await send(req, req.url, { root: fixtures })
      if (type === 'directory') {
        const list = await readdir(metadata.path)
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=UTF-8' })
        res.end(list.join('\n') + '\n')
      } else {
        res.writeHead(statusCode, headers)
        stream.pipe(res)
      }
    })

    request(app)
      .get('/pets')
      .expect('Content-Type', 'text/plain; charset=UTF-8')
      .expect(200, '.hidden\nindex.html\n', err => t.error(err))
  })

  t.test('serving from a root directory with custom error-handling', function (t) {
    t.plan(3)

    const app = http.createServer(async function (req, res) {
      const { statusCode, headers, stream, type, metadata } = await send(req, req.url, { root: fixtures })
      switch (type) {
        case 'directory': {
          res.writeHead(301, {
            Location: metadata.requestPath + '/'
          })
          res.end('Redirecting to ' + metadata.requestPath + '/')
          break
        }
        case 'error': {
          res.writeHead(metadata.error.status ?? 500, {})
          res.end(metadata.error.message)
          break
        }
        default: {
          // serve all files for download
          res.setHeader('Content-Disposition', 'attachment')
          res.writeHead(statusCode, headers)
          stream.pipe(res)
        }
      }
    })

    request(app)
      .get('/pets')
      .expect('Location', '/pets/')
      .expect(301, err => t.error(err))

    request(app)
      .get('/not-exists')
      .expect(404, err => t.error(err))

    request(app)
      .get('/pets/index.html')
      .expect('Content-Disposition', 'attachment')
      .expect(200, err => t.error(err))
  })
})

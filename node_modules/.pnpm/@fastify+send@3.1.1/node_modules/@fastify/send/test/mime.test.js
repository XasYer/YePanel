'use strict'

const { test } = require('tap')
const path = require('node:path')
const request = require('supertest')
const send = require('..')
const { shouldNotHaveHeader, createServer } = require('./utils')

const fixtures = path.join(__dirname, 'fixtures')

test('send.mime', function (t) {
  t.plan(2)

  t.test('should be exposed', function (t) {
    t.plan(1)
    t.ok(send.mime)
  })

  t.test('.default_type', function (t) {
    t.plan(3)

    t.before(() => {
      this.default_type = send.mime.default_type
    })

    t.afterEach(() => {
      send.mime.default_type = this.default_type
    })

    t.test('should change the default type', function (t) {
      t.plan(1)
      send.mime.default_type = 'text/plain'

      request(createServer({ root: fixtures }))
        .get('/no_ext')
        .expect('Content-Type', 'text/plain; charset=UTF-8')
        .expect(200, err => t.error(err))
    })

    t.test('should not add Content-Type for undefined default', function (t) {
      t.plan(2)
      send.mime.default_type = undefined

      request(createServer({ root: fixtures }))
        .get('/no_ext')
        .expect(shouldNotHaveHeader('Content-Type', t))
        .expect(200, err => t.error(err))
    })

    t.test('should return Content-Type without charset', function (t) {
      t.plan(1)

      request(createServer({ root: fixtures }))
        .get('/images/node-js.png')
        .expect('Content-Type', 'image/png')
        .expect(200, err => t.error(err))
    })
  })
})

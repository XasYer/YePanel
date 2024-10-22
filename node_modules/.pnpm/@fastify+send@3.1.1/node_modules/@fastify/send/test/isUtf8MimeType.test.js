'use strict'

const { test } = require('tap')
const { isUtf8MimeType } = require('../lib/isUtf8MimeType')

test('isUtf8MimeType', function (t) {
  const testCases = [
    ['application/json', true],
    ['text/json', true],
    ['application/javascript', true],
    ['text/javascript', true],
    ['application/json+v5', true],
    ['text/xml', true],
    ['text/html', true],
    ['image/png', false]
  ]
  t.plan(testCases.length)

  for (let i = 0; i < testCases.length; ++i) {
    t.strictSame(isUtf8MimeType(testCases[i][0], 'test'), testCases[i][1])
  }
})

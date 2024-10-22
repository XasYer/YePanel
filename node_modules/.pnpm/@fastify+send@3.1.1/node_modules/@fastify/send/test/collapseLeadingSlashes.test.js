'use strict'

const { test } = require('tap')
const { collapseLeadingSlashes } = require('../lib/collapseLeadingSlashes')

test('collapseLeadingSlashes', function (t) {
  const testCases = [
    ['abcd', 'abcd'],
    ['text/json', 'text/json'],
    ['/text/json', '/text/json'],
    ['//text/json', '/text/json'],
    ['///text/json', '/text/json'],
    ['/.//text/json', '/.//text/json'],
    ['//./text/json', '/./text/json'],
    ['///./text/json', '/./text/json']
  ]
  t.plan(testCases.length)

  for (let i = 0; i < testCases.length; ++i) {
    t.strictSame(collapseLeadingSlashes(testCases[i][0]), testCases[i][1])
  }
})

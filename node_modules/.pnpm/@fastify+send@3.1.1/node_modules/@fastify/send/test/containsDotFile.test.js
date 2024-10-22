'use strict'

const { test } = require('tap')
const { containsDotFile } = require('../lib/containsDotFile')

test('containsDotFile', function (t) {
  const testCases = [
    ['/.github', true],
    ['.github', true],
    ['index.html', false],
    ['./index.html', false]
  ]
  t.plan(testCases.length)

  for (let i = 0; i < testCases.length; ++i) {
    t.strictSame(containsDotFile(testCases[i][0].split('/')), testCases[i][1], testCases[i][0])
  }
})

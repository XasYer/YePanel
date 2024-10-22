'use strict'

const { test } = require('tap')
const { normalizeList } = require('../lib/normalizeList')

test('normalizeList', function (t) {
  const testCases = [
    [undefined, new Error('test must be array of strings or false')],
    [false, []],
    [[], []],
    ['', ['']],
    [[''], ['']],
    [['a'], ['a']],
    ['a', ['a']],
    [true, new Error('test must be array of strings or false')],
    [1, new Error('test must be array of strings or false')],
    [[1], new Error('test must be array of strings or false')]
  ]
  t.plan(testCases.length)

  for (let i = 0; i < testCases.length; ++i) {
    if (testCases[i][1] instanceof Error) {
      t.throws(() => normalizeList(testCases[i][0], 'test'), testCases[i][1])
    } else {
      t.strictSame(normalizeList(testCases[i][0], 'test'), testCases[i][1])
    }
  }
})

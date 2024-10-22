'use strict'

const { test } = require('tap')
const fs = require('node:fs')
const http = require('node:http')
const path = require('node:path')
const request = require('supertest')
const send = require('..').send
const { shouldNotHaveHeader, createServer } = require('./utils')

// test server

const fixtures = path.join(__dirname, 'fixtures')

test('send(file, options)', function (t) {
  t.plan(10)

  t.test('acceptRanges', function (t) {
    t.plan(2)

    t.test('should support disabling accept-ranges', function (t) {
      t.plan(2)

      request(createServer({ acceptRanges: false, root: fixtures }))
        .get('/nums.txt')
        .expect(shouldNotHaveHeader('Accept-Ranges', t))
        .expect(200, err => t.error(err))
    })

    t.test('should ignore requested range', function (t) {
      t.plan(3)

      request(createServer({ acceptRanges: false, root: fixtures }))
        .get('/nums.txt')
        .set('Range', 'bytes=0-2')
        .expect(shouldNotHaveHeader('Accept-Ranges', t))
        .expect(shouldNotHaveHeader('Content-Range', t))
        .expect(200, '123456789', err => t.error(err))
    })
  })

  t.test('cacheControl', function (t) {
    t.plan(2)

    t.test('should support disabling cache-control', function (t) {
      t.plan(2)
      request(createServer({ cacheControl: false, root: fixtures }))
        .get('/name.txt')
        .expect(shouldNotHaveHeader('Cache-Control', t))
        .expect(200, err => t.error(err))
    })

    t.test('should ignore maxAge option', function (t) {
      t.plan(2)

      request(createServer({ cacheControl: false, maxAge: 1000, root: fixtures }))
        .get('/name.txt')
        .expect(shouldNotHaveHeader('Cache-Control', t))
        .expect(200, err => t.error(err))
    })
  })

  t.test('etag', function (t) {
    t.plan(1)

    t.test('should support disabling etags', function (t) {
      t.plan(2)

      request(createServer({ etag: false, root: fixtures }))
        .get('/name.txt')
        .expect(shouldNotHaveHeader('ETag', t))
        .expect(200, err => t.error(err))
    })
  })

  t.test('extensions', function (t) {
    t.plan(9)

    t.test('should reject numbers', function (t) {
      t.plan(1)

      request(createServer({ extensions: 42, root: fixtures }))
        .get('/pets/')
        .expect(500, /TypeError: extensions option/, err => t.error(err))
    })

    t.test('should reject true', function (t) {
      t.plan(1)

      request(createServer({ extensions: true, root: fixtures }))
        .get('/pets/')
        .expect(500, /TypeError: extensions option/, err => t.error(err))
    })

    t.test('should be not be enabled by default', function (t) {
      t.plan(1)

      request(createServer({ root: fixtures }))
        .get('/tobi')
        .expect(404, err => t.error(err))
    })

    t.test('should be configurable', function (t) {
      t.plan(1)

      request(createServer({ extensions: 'txt', root: fixtures }))
        .get('/name')
        .expect(200, 'tobi', err => t.error(err))
    })

    t.test('should support disabling extensions', function (t) {
      t.plan(1)

      request(createServer({ extensions: false, root: fixtures }))
        .get('/name')
        .expect(404, err => t.error(err))
    })

    t.test('should support fallbacks', function (t) {
      t.plan(1)

      request(createServer({ extensions: ['htm', 'html', 'txt'], root: fixtures }))
        .get('/name')
        .expect(200, '<p>tobi</p>', err => t.error(err))
    })

    t.test('should 404 if nothing found', function (t) {
      t.plan(1)

      request(createServer({ extensions: ['htm', 'html', 'txt'], root: fixtures }))
        .get('/bob')
        .expect(404, err => t.error(err))
    })

    t.test('should skip directories', function (t) {
      t.plan(1)

      request(createServer({ extensions: ['file', 'dir'], root: fixtures }))
        .get('/name')
        .expect(404, err => t.error(err))
    })

    t.test('should not search if file has extension', function (t) {
      t.plan(1)

      request(createServer({ extensions: 'html', root: fixtures }))
        .get('/thing.html')
        .expect(404, err => t.error(err))
    })
  })

  t.test('lastModified', function (t) {
    t.plan(1)

    t.test('should support disabling last-modified', function (t) {
      t.plan(2)

      request(createServer({ lastModified: false, root: fixtures }))
        .get('/name.txt')
        .expect(shouldNotHaveHeader('Last-Modified', t))
        .expect(200, err => t.error(err))
    })
  })

  t.test('dotfiles', function (t) {
    t.plan(5)

    t.test('should default to "ignore"', function (t) {
      t.plan(1)

      request(createServer({ root: fixtures }))
        .get('/.hidden.txt')
        .expect(404, err => t.error(err))
    })

    t.test('should reject bad value', function (t) {
      t.plan(1)

      request(createServer({ dotfiles: 'bogus' }))
        .get('/name.txt')
        .expect(500, /dotfiles/, err => t.error(err))
    })

    t.test('when "allow"', function (t) {
      t.plan(3)

      t.test('should send dotfile', function (t) {
        t.plan(1)
        request(createServer({ dotfiles: 'allow', root: fixtures }))
          .get('/.hidden.txt')
          .expect(200, 'secret', err => t.error(err))
      })

      t.test('should send within dotfile directory', function (t) {
        t.plan(1)
        request(createServer({ dotfiles: 'allow', root: fixtures }))
          .get('/.mine/name.txt')
          .expect(200, /tobi/, err => t.error(err))
      })

      t.test('should 404 for non-existent dotfile', function (t) {
        t.plan(1)
        request(createServer({ dotfiles: 'allow', root: fixtures }))
          .get('/.nothere')
          .expect(404, err => t.error(err))
      })
    })

    t.test('when "deny"', function (t) {
      t.plan(10)

      t.test('should 403 for dotfile', function (t) {
        t.plan(1)
        request(createServer({ dotfiles: 'deny', root: fixtures }))
          .get('/.hidden.txt')
          .expect(403, err => t.error(err))
      })

      t.test('should 403 for dotfile directory', function (t) {
        t.plan(1)
        request(createServer({ dotfiles: 'deny', root: fixtures }))
          .get('/.mine')
          .expect(403, err => t.error(err))
      })

      t.test('should 403 for dotfile directory with trailing slash', function (t) {
        t.plan(1)
        request(createServer({ dotfiles: 'deny', root: fixtures }))
          .get('/.mine/')
          .expect(403, err => t.error(err))
      })

      t.test('should 403 for file within dotfile directory', function (t) {
        t.plan(1)
        request(createServer({ dotfiles: 'deny', root: fixtures }))
          .get('/.mine/name.txt')
          .expect(403, err => t.error(err))
      })

      t.test('should 403 for non-existent dotfile', function (t) {
        t.plan(1)
        request(createServer({ dotfiles: 'deny', root: fixtures }))
          .get('/.nothere')
          .expect(403, err => t.error(err))
      })

      t.test('should 403 for non-existent dotfile directory', function (t) {
        t.plan(1)
        request(createServer({ dotfiles: 'deny', root: fixtures }))
          .get('/.what/name.txt')
          .expect(403, err => t.error(err))
      })

      t.test('should 403 for dotfile in directory', function (t) {
        t.plan(1)
        request(createServer({ dotfiles: 'deny', root: fixtures }))
          .get('/pets/.hidden')
          .expect(403, err => t.error(err))
      })

      t.test('should 403 for dotfile in dotfile directory', function (t) {
        t.plan(1)
        request(createServer({ dotfiles: 'deny', root: fixtures }))
          .get('/.mine/.hidden')
          .expect(403, err => t.error(err))
      })

      t.test('should send files in root dotfile directory', function (t) {
        t.plan(1)
        request(createServer({ dotfiles: 'deny', root: path.join(fixtures, '.mine') }))
          .get('/name.txt')
          .expect(200, /tobi/, err => t.error(err))
      })

      t.test('should 403 for dotfile without root', function (t) {
        t.plan(1)
        const server = http.createServer(async function onRequest (req, res) {
          const { statusCode, headers, stream } = await send(req, fixtures + '/.mine' + req.url, { dotfiles: 'deny' })
          res.writeHead(statusCode, headers)
          stream.pipe(res)
        })

        request(server)
          .get('/name.txt')
          .expect(403, err => t.error(err))
      })
    })

    t.test('when "ignore"', function (t) {
      t.plan(8)

      t.test('should 404 for dotfile', function (t) {
        t.plan(1)

        request(createServer({ dotfiles: 'ignore', root: fixtures }))
          .get('/.hidden.txt')
          .expect(404, err => t.error(err))
      })

      t.test('should 404 for dotfile directory', function (t) {
        t.plan(1)

        request(createServer({ dotfiles: 'ignore', root: fixtures }))
          .get('/.mine')
          .expect(404, err => t.error(err))
      })

      t.test('should 404 for dotfile directory with trailing slash', function (t) {
        t.plan(1)

        request(createServer({ dotfiles: 'ignore', root: fixtures }))
          .get('/.mine/')
          .expect(404, err => t.error(err))
      })

      t.test('should 404 for file within dotfile directory', function (t) {
        t.plan(1)

        request(createServer({ dotfiles: 'ignore', root: fixtures }))
          .get('/.mine/name.txt')
          .expect(404, err => t.error(err))
      })

      t.test('should 404 for non-existent dotfile', function (t) {
        t.plan(1)

        request(createServer({ dotfiles: 'ignore', root: fixtures }))
          .get('/.nothere')
          .expect(404, err => t.error(err))
      })

      t.test('should 404 for non-existent dotfile directory', function (t) {
        t.plan(1)

        request(createServer({ dotfiles: 'ignore', root: fixtures }))
          .get('/.what/name.txt')
          .expect(404, err => t.error(err))
      })

      t.test('should send files in root dotfile directory', function (t) {
        t.plan(1)

        request(createServer({ dotfiles: 'ignore', root: path.join(fixtures, '.mine') }))
          .get('/name.txt')
          .expect(200, /tobi/, err => t.error(err))
      })

      t.test('should 404 for dotfile without root', function (t) {
        t.plan(1)

        const server = http.createServer(async function onRequest (req, res) {
          const { statusCode, headers, stream } = await send(req, fixtures + '/.mine' + req.url, { dotfiles: 'ignore' })
          res.writeHead(statusCode, headers)
          stream.pipe(res)
        })

        request(server)
          .get('/name.txt')
          .expect(404, err => t.error(err))
      })
    })
  })

  t.test('immutable', function (t) {
    t.plan(2)

    t.test('should default to false', function (t) {
      t.plan(1)

      request(createServer({ root: fixtures }))
        .get('/name.txt')
        .expect('Cache-Control', 'public, max-age=0', err => t.error(err))
    })

    t.test('should set immutable directive in Cache-Control', function (t) {
      t.plan(1)

      request(createServer({ immutable: true, maxAge: '1h', root: fixtures }))
        .get('/name.txt')
        .expect('Cache-Control', 'public, max-age=3600, immutable', err => t.error(err))
    })
  })

  t.test('maxAge', function (t) {
    t.plan(4)

    t.test('should default to 0', function (t) {
      t.plan(1)
      request(createServer({ root: fixtures }))
        .get('/name.txt')
        .expect('Cache-Control', 'public, max-age=0', err => t.error(err))
    })

    t.test('should floor to integer', function (t) {
      t.plan(1)
      request(createServer({ maxAge: 123956, root: fixtures }))
        .get('/name.txt')
        .expect('Cache-Control', 'public, max-age=123', err => t.error(err))
    })

    t.test('should accept string', function (t) {
      t.plan(1)
      request(createServer({ maxAge: '30d', root: fixtures }))
        .get('/name.txt')
        .expect('Cache-Control', 'public, max-age=2592000', err => t.error(err))
    })

    t.test('should max at 1 year', function (t) {
      t.plan(1)
      request(createServer({ maxAge: '2y', root: fixtures }))
        .get('/name.txt')
        .expect('Cache-Control', 'public, max-age=31536000', err => t.error(err))
    })
  })

  t.test('index', function (t) {
    t.plan(10)

    t.test('should reject numbers', function (t) {
      t.plan(1)

      request(createServer({ root: fixtures, index: 42 }))
        .get('/pets/')
        .expect(500, /TypeError: index option/, err => t.error(err))
    })

    t.test('should reject true', function (t) {
      t.plan(1)

      request(createServer({ root: fixtures, index: true }))
        .get('/pets/')
        .expect(500, /TypeError: index option/, err => t.error(err))
    })

    t.test('should default to index.html', function (t) {
      t.plan(1)

      request(createServer({ root: fixtures }))
        .get('/pets/')
        .expect(fs.readFileSync(path.join(fixtures, 'pets', 'index.html'), 'utf8'), err => t.error(err))
    })

    t.test('should be configurable', function (t) {
      t.plan(1)

      request(createServer({ root: fixtures, index: 'tobi.html' }))
        .get('/')
        .expect(200, '<p>tobi</p>', err => t.error(err))
    })

    t.test('should support disabling', function (t) {
      t.plan(1)

      request(createServer({ root: fixtures, index: false }))
        .get('/pets/')
        .expect(403, err => t.error(err))
    })

    t.test('should support fallbacks', function (t) {
      t.plan(1)

      request(createServer({ root: fixtures, index: ['default.htm', 'index.html'] }))
        .get('/pets/')
        .expect(200, fs.readFileSync(path.join(fixtures, 'pets', 'index.html'), 'utf8'), err => t.error(err))
    })

    t.test('should 404 if no index file found (file)', function (t) {
      t.plan(1)

      request(createServer({ root: fixtures, index: 'default.htm' }))
        .get('/pets/')
        .expect(404, err => t.error(err))
    })

    t.test('should 404 if no index file found (dir)', function (t) {
      t.plan(1)

      request(createServer({ root: fixtures, index: 'pets' }))
        .get('/')
        .expect(404, err => t.error(err))
    })

    t.test('should not follow directories', function (t) {
      t.plan(1)

      request(createServer({ root: fixtures, index: ['pets', 'name.txt'] }))
        .get('/')
        .expect(200, 'tobi', err => t.error(err))
    })

    t.test('should work without root', function (t) {
      t.plan(1)

      const server = http.createServer(async function (req, res) {
        const p = path.join(fixtures, 'pets').replace(/\\/g, '/') + '/'
        const { statusCode, headers, stream } = await send(req, p, { index: ['index.html'] })
        res.writeHead(statusCode, headers)
        stream.pipe(res)
      })

      request(server)
        .get('/')
        .expect(200, /tobi/, err => t.error(err))
    })
  })

  t.test('root', function (t) {
    t.plan(2)

    t.test('when given', function (t) {
      t.plan(8)

      t.test('should join root', function (t) {
        t.plan(1)
        request(createServer({ root: fixtures }))
          .get('/pets/../name.txt')
          .expect(200, 'tobi', err => t.error(err))
      })

      t.test('should work with trailing slash', function (t) {
        t.plan(1)

        const app = http.createServer(async function (req, res) {
          const { statusCode, headers, stream } = await send(req, req.url, { root: fixtures + '/' })
          res.writeHead(statusCode, headers)
          stream.pipe(res)
        })

        request(app)
          .get('/name.txt')
          .expect(200, 'tobi', err => t.error(err))
      })

      t.test('should work with empty path', function (t) {
        t.plan(1)

        const app = http.createServer(async function (req, res) {
          const { statusCode, headers, stream } = await send(req, '', { root: fixtures })
          res.writeHead(statusCode, headers)
          stream.pipe(res)
        })

        request(app)
          .get('/name.txt')
          .expect(301, /Redirecting to/, err => t.error(err))
      })

      //
      // NOTE: This is not a real part of the API, but
      //       over time this has become something users
      //       are doing, so this will prevent unseen
      //       regressions around this use-case.
      //
      t.test('should try as file with empty path', function (t) {
        t.plan(1)

        const app = http.createServer(async function (req, res) {
          const { statusCode, headers, stream } = await send(req, '', { root: path.join(fixtures, 'name.txt') })
          res.writeHead(statusCode, headers)
          stream.pipe(res)
        })

        request(app)
          .get('/')
          .expect(200, 'tobi', err => t.error(err))
      })

      t.test('should restrict paths to within root', function (t) {
        t.plan(1)

        request(createServer({ root: fixtures }))
          .get('/pets/../../send.js')
          .expect(403, err => t.error(err))
      })

      t.test('should allow .. in root', function (t) {
        t.plan(1)

        const app = http.createServer(async function (req, res) {
          const { statusCode, headers, stream } = await send(req, req.url, { root: fixtures + '/../fixtures' })
          res.writeHead(statusCode, headers)
          stream.pipe(res)
        })

        request(app)
          .get('/pets/../../send.js')
          .expect(403, err => t.error(err))
      })

      t.test('should not allow root transversal', function (t) {
        t.plan(1)

        request(createServer({ root: path.join(fixtures, 'name.d') }))
          .get('/../name.dir/name.txt')
          .expect(403, err => t.error(err))
      })

      t.test('should not allow root path disclosure', function (t) {
        t.plan(1)

        request(createServer({ root: fixtures }))
          .get('/pets/../../fixtures/name.txt')
          .expect(403, err => t.error(err))
      })
    })

    t.test('when missing', function (t) {
      t.plan(2)

      t.test('should consider .. malicious', function (t) {
        t.plan(1)

        const app = http.createServer(async function (req, res) {
          const { statusCode, headers, stream } = await send(req, fixtures + req.url)
          res.writeHead(statusCode, headers)
          stream.pipe(res)
        })

        request(app)
          .get('/../send.js')
          .expect(403, err => t.error(err))
      })

      t.test('should still serve files with dots in name', function (t) {
        t.plan(1)

        const app = http.createServer(async function (req, res) {
          const { statusCode, headers, stream } = await send(req, fixtures + req.url)
          res.writeHead(statusCode, headers)
          stream.pipe(res)
        })

        request(app)
          .get('/do..ts.txt')
          .expect(200, '...', err => t.error(err))
      })
    })
  })
})

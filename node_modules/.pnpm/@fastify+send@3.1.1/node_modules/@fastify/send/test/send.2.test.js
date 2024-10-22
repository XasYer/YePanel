'use strict'

const { test } = require('tap')
const http = require('node:http')
const path = require('node:path')
const request = require('supertest')
const send = require('../lib/send').send
const { shouldNotHaveBody, createServer, shouldNotHaveHeader } = require('./utils')

const dateRegExp = /^\w{3}, \d+ \w+ \d+ \d+:\d+:\d+ \w+$/
const fixtures = path.join(__dirname, 'fixtures')

test('send(file)', function (t) {
  t.plan(22)

  t.test('should stream the file contents', function (t) {
    t.plan(1)

    const app = http.createServer(async function (req, res) {
      const { statusCode, headers, stream } = await send(req, req.url, { root: fixtures })
      res.writeHead(statusCode, headers)
      stream.pipe(res)
    })

    request(app)
      .get('/name.txt')
      .expect('Content-Length', '4')
      .expect(200, 'tobi', err => t.error(err))
  })

  t.test('should stream a zero-length file', function (t) {
    t.plan(1)

    const app = http.createServer(async function (req, res) {
      const { statusCode, headers, stream } = await send(req, req.url, { root: fixtures })
      res.writeHead(statusCode, headers)
      stream.pipe(res)
    })

    request(app)
      .get('/empty.txt')
      .expect('Content-Length', '0')
      .expect(200, '', err => t.error(err))
  })

  t.test('should decode the given path as a URI', function (t) {
    t.plan(1)

    const app = http.createServer(async function (req, res) {
      const { statusCode, headers, stream } = await send(req, req.url, { root: fixtures })
      res.writeHead(statusCode, headers)
      stream.pipe(res)
    })

    request(app)
      .get('/some%20thing.txt')
      .expect(200, 'hey', err => t.error(err))
  })

  t.test('should serve files with dots in name', function (t) {
    t.plan(1)

    const app = http.createServer(async function (req, res) {
      const { statusCode, headers, stream } = await send(req, req.url, { root: fixtures })
      res.writeHead(statusCode, headers)
      stream.pipe(res)
    })

    request(app)
      .get('/do..ts.txt')
      .expect(200, '...', err => t.error(err))
  })

  t.test('should treat a malformed URI as a bad request', function (t) {
    t.plan(1)

    const app = http.createServer(async function (req, res) {
      const { statusCode, headers, stream } = await send(req, req.url, { root: fixtures })
      res.writeHead(statusCode, headers)
      stream.pipe(res)
    })

    request(app)
      .get('/some%99thing.txt')
      .expect(400, /Bad Request/, err => t.error(err))
  })

  t.test('should 400 on NULL bytes', function (t) {
    t.plan(1)

    const app = http.createServer(async function (req, res) {
      const { statusCode, headers, stream } = await send(req, req.url, { root: fixtures })
      res.writeHead(statusCode, headers)
      stream.pipe(res)
    })

    request(app)
      .get('/some%00thing.txt')
      .expect(400, /Bad Request/, err => t.error(err))
  })

  t.test('should treat an ENAMETOOLONG as a 404', function (t) {
    t.plan(1)

    const app = http.createServer(async function (req, res) {
      const { statusCode, headers, stream } = await send(req, req.url, { root: fixtures })
      res.writeHead(statusCode, headers)
      stream.pipe(res)
    })

    const path = Array(100).join('foobar')
    request(app)
      .get('/' + path)
      .expect(404, err => t.error(err))
  })

  t.test('should support HEAD', function (t) {
    t.plan(2)

    const app = http.createServer(async function (req, res) {
      const { statusCode, headers, stream } = await send(req, req.url, { root: fixtures })
      res.writeHead(statusCode, headers)
      stream.pipe(res)
    })

    request(app)
      .head('/name.txt')
      .expect(200)
      .expect('Content-Length', '4')
      .expect(shouldNotHaveBody(t))
      .end(err => t.error(err))
  })

  t.test('should add an ETag header field', function (t) {
    t.plan(1)

    const app = http.createServer(async function (req, res) {
      const { statusCode, headers, stream } = await send(req, req.url, { root: fixtures })
      res.writeHead(statusCode, headers)
      stream.pipe(res)
    })

    request(app)
      .get('/name.txt')
      .expect('etag', /^W\/"[^"]+"$/)
      .end(err => t.error(err))
  })

  t.test('should add a Date header field', function (t) {
    t.plan(1)

    const app = http.createServer(async function (req, res) {
      const { statusCode, headers, stream } = await send(req, req.url, { root: fixtures })
      res.writeHead(statusCode, headers)
      stream.pipe(res)
    })

    request(app)
      .get('/name.txt')
      .expect('date', dateRegExp, err => t.error(err))
  })

  t.test('should add a Last-Modified header field', function (t) {
    t.plan(1)

    const app = http.createServer(async function (req, res) {
      const { statusCode, headers, stream } = await send(req, req.url, { root: fixtures })
      res.writeHead(statusCode, headers)
      stream.pipe(res)
    })

    request(app)
      .get('/name.txt')
      .expect('last-modified', dateRegExp, err => t.error(err))
  })

  t.test('should add a Accept-Ranges header field', function (t) {
    t.plan(1)

    const app = http.createServer(async function (req, res) {
      const { statusCode, headers, stream } = await send(req, req.url, { root: fixtures })
      res.writeHead(statusCode, headers)
      stream.pipe(res)
    })

    request(app)
      .get('/name.txt')
      .expect('Accept-Ranges', 'bytes', err => t.error(err))
  })

  t.test('should 404 if the file does not exist', function (t) {
    t.plan(1)

    const app = http.createServer(async function (req, res) {
      const { statusCode, headers, stream } = await send(req, req.url, { root: fixtures })
      res.writeHead(statusCode, headers)
      stream.pipe(res)
    })

    request(app)
      .get('/meow')
      .expect(404, /Not Found/, err => t.error(err))
  })

  t.test('should 404 if the filename is too long', function (t) {
    t.plan(1)

    const app = http.createServer(async function (req, res) {
      const { statusCode, headers, stream } = await send(req, req.url, { root: fixtures })
      res.writeHead(statusCode, headers)
      stream.pipe(res)
    })

    const longFilename = new Array(512).fill('a').join('')

    request(app)
      .get('/' + longFilename)
      .expect(404, /Not Found/, err => t.error(err))
  })

  t.test('should 404 if the requested resource is not a directory', function (t) {
    t.plan(1)

    const app = http.createServer(async function (req, res) {
      const { statusCode, headers, stream } = await send(req, req.url, { root: fixtures })
      res.writeHead(statusCode, headers)
      stream.pipe(res)
    })

    request(app)
      .get('/nums.txt/invalid')
      .expect(404, /Not Found/, err => t.error(err))
  })

  t.test('should not override content-type', function (t) {
    t.plan(1)

    const app = http.createServer(async function (req, res) {
      const { statusCode, headers, stream } = await send(req, req.url, { root: fixtures })
      res.writeHead(statusCode, {
        ...headers,
        'Content-Type': 'application/x-custom'
      })
      stream.pipe(res)
    })
    request(app)
      .get('/name.txt')
      .expect('Content-Type', 'application/x-custom', err => t.error(err))
  })

  t.test('should set Content-Type via mime map', function (t) {
    t.plan(2)

    const app = http.createServer(async function (req, res) {
      const { statusCode, headers, stream } = await send(req, req.url, { root: fixtures })
      res.writeHead(statusCode, headers)
      stream.pipe(res)
    })

    request(app)
      .get('/name.txt')
      .expect('Content-Type', 'text/plain; charset=UTF-8')
      .expect(200, function (err) {
        t.error(err)
        request(app)
          .get('/tobi.html')
          .expect('Content-Type', 'text/html; charset=UTF-8')
          .expect(200, err => t.error(err))
      })
  })

  t.test('send directory', function (t) {
    t.plan(5)

    t.test('should redirect directories to trailing slash', function (t) {
      t.plan(1)

      request(createServer({ root: fixtures }))
        .get('/pets')
        .expect('Location', '/pets/')
        .expect(301, err => t.error(err))
    })

    t.test('should respond with an HTML redirect', function (t) {
      t.plan(1)

      request(createServer({ root: fixtures }))
        .get('/pets')
        .expect('Location', '/pets/')
        .expect('Content-Type', /html/)
        .expect(301, />Redirecting to \/pets\/</, err => t.error(err))
    })

    t.test('should respond with default Content-Security-Policy', function (t) {
      t.plan(1)

      request(createServer({ root: fixtures }))
        .get('/pets')
        .expect('Location', '/pets/')
        .expect('Content-Security-Policy', "default-src 'none'")
        .expect(301, err => t.error(err))
    })

    t.test('should not redirect to protocol-relative locations', function (t) {
      t.plan(1)

      request(createServer({ root: fixtures }))
        .get('//pets')
        .expect('Location', '/pets/')
        .expect(301, err => t.error(err))
    })

    t.test('should respond with an HTML redirect', function (t) {
      t.plan(1)

      const app = http.createServer(async function (req, res) {
        const { statusCode, headers, stream } = await send(req, req.url.replace('/snow', '/snow ☃'), { root: 'test/fixtures' })
        res.writeHead(statusCode, headers)
        stream.pipe(res)
      })

      request(app)
        .get('/snow')
        .expect('Location', '/snow%20%E2%98%83/')
        .expect('Content-Type', /html/)
        .expect(301, />Redirecting to \/snow%20%E2%98%83\/</, err => t.error(err))
    })
  })

  t.test('send error', function (t) {
    t.plan(2)

    t.test('should respond to errors directly', function (t) {
      t.plan(1)

      request(createServer({ root: fixtures }))
        .get('/foobar')
        .expect(404, />Not Found</, err => t.error(err))
    })

    t.test('should respond with default Content-Security-Policy', function (t) {
      t.plan(1)

      request(createServer({ root: fixtures }))
        .get('/foobar')
        .expect('Content-Security-Policy', "default-src 'none'")
        .expect(404, err => t.error(err))
    })
  })

  t.test('with conditional-GET', function (t) {
    t.plan(6)

    t.test('should remove Content headers with 304', function (t) {
      t.plan(2)

      const server = createServer({ root: fixtures }, function (req, res) {
        res.setHeader('Content-Language', 'en-US')
        res.setHeader('Content-Location', 'http://localhost/name.txt')
        res.setHeader('Contents', 'foo')
      })

      request(server)
        .get('/name.txt')
        .expect(200, function (err, res) {
          t.error(err)
          request(server)
            .get('/name.txt')
            .set('If-None-Match', res.headers.etag)
            .expect('Content-Location', 'http://localhost/name.txt')
            .expect('Contents', 'foo')
            .expect(304, err => t.error(err))
        })
    })

    t.test('should not remove all Content-* headers', function (t) {
      t.plan(2)

      const server = createServer({ root: fixtures }, function (req, res) {
        res.setHeader('Content-Location', 'http://localhost/name.txt')
        res.setHeader('Content-Security-Policy', 'default-src \'self\'')
      })

      request(server)
        .get('/name.txt')
        .expect(200, function (err, res) {
          t.error(err)
          request(server)
            .get('/name.txt')
            .set('If-None-Match', res.headers.etag)
            .expect('Content-Location', 'http://localhost/name.txt')
            .expect('Content-Security-Policy', 'default-src \'self\'')
            .expect(304, err => t.error(err))
        })
    })

    t.test('where "If-Match" is set', function (t) {
      t.plan(4)

      t.test('should respond with 200 when "*"', function (t) {
        t.plan(1)

        const app = http.createServer(async function (req, res) {
          const { statusCode, headers, stream } = await send(req, req.url, { root: fixtures })
          res.writeHead(statusCode, headers)
          stream.pipe(res)
        })

        request(app)
          .get('/name.txt')
          .set('If-Match', '*')
          .expect(200, err => t.error(err))
      })

      t.test('should respond with 412 when ETag unmatched', function (t) {
        t.plan(1)

        const app = http.createServer(async function (req, res) {
          const { statusCode, headers, stream } = await send(req, req.url, { root: fixtures })
          res.writeHead(statusCode, headers)
          stream.pipe(res)
        })

        request(app)
          .get('/name.txt')
          .set('If-Match', ' "foo",, "bar" ,')
          .expect(412, err => t.error(err))
      })

      t.test('should respond with 200 when ETag matched /1', function (t) {
        t.plan(2)

        const app = http.createServer(async function (req, res) {
          const { statusCode, headers, stream } = await send(req, req.url, { root: fixtures })
          res.writeHead(statusCode, headers)
          stream.pipe(res)
        })

        request(app)
          .get('/name.txt')
          .expect(200, function (err, res) {
            t.error(err)
            request(app)
              .get('/name.txt')
              .set('If-Match', '"foo", "bar", ' + res.headers.etag)
              .expect(200, err => t.error(err))
          })
      })

      t.test('should respond with 200 when ETag matched /2', function (t) {
        t.plan(2)

        const app = http.createServer(async function (req, res) {
          const { statusCode, headers, stream } = await send(req, req.url, { root: fixtures })
          res.writeHead(statusCode, headers)
          stream.pipe(res)
        })

        request(app)
          .get('/name.txt')
          .expect(200, function (err, res) {
            t.error(err)
            request(app)
              .get('/name.txt')
              .set('If-Match', '"foo", ' + res.headers.etag + ', "bar"')
              .expect(200, err => t.error(err))
          })
      })
    })

    t.test('where "If-Modified-Since" is set', function (t) {
      t.plan(3)

      t.test('should respond with 304 when unmodified', function (t) {
        t.plan(2)

        const app = http.createServer(async function (req, res) {
          const { statusCode, headers, stream } = await send(req, req.url, { root: fixtures })
          res.writeHead(statusCode, headers)
          stream.pipe(res)
        })

        request(app)
          .get('/name.txt')
          .expect(200, function (err, res) {
            t.error(err)
            request(app)
              .get('/name.txt')
              .set('If-Modified-Since', res.headers['last-modified'])
              .expect(304, err => t.error(err))
          })
      })

      t.test('should respond with 200 when modified', function (t) {
        t.plan(2)

        const app = http.createServer(async function (req, res) {
          const { statusCode, headers, stream } = await send(req, req.url, { root: fixtures })
          res.writeHead(statusCode, headers)
          stream.pipe(res)
        })

        request(app)
          .get('/name.txt')
          .expect(200, function (err, res) {
            t.error(err)
            const lmod = new Date(res.headers['last-modified'])
            const date = new Date(lmod - 60000)
            request(app)
              .get('/name.txt')
              .set('If-Modified-Since', date.toUTCString())
              .expect(200, 'tobi', err => t.error(err))
          })
      })

      t.test('should respond with 200 when modified', function (t) {
        t.plan(2)

        const app = http.createServer(async function (req, res) {
          const { statusCode, headers, stream } = await send(req, req.url, { root: fixtures })
          res.writeHead(statusCode, headers)
          stream.pipe(res)
        })

        request(app)
          .get('/name.txt')
          .expect(200, function (err, res) {
            t.error(err)
            request(app)
              .get('/name.txt')
              .set('If-Modified-Since', res.headers['last-modified'])
              .set('cache-control', 'no-cache')
              .expect(200, 'tobi', err => t.error(err))
          })
      })
    })

    t.test('where "If-None-Match" is set', function (t) {
      t.plan(6)

      t.test('should respond with 304 when ETag matched', function (t) {
        t.plan(2)

        const app = http.createServer(async function (req, res) {
          const { statusCode, headers, stream } = await send(req, req.url, { root: fixtures })
          res.writeHead(statusCode, headers)
          stream.pipe(res)
        })

        request(app)
          .get('/name.txt')
          .expect(200, function (err, res) {
            t.error(err)
            request(app)
              .get('/name.txt')
              .set('If-None-Match', res.headers.etag)
              .expect(304, err => t.error(err))
          })
      })

      t.test('should respond with 200 when ETag unmatched', function (t) {
        t.plan(2)

        const app = http.createServer(async function (req, res) {
          const { statusCode, headers, stream } = await send(req, req.url, { root: fixtures })
          res.writeHead(statusCode, headers)
          stream.pipe(res)
        })

        request(app)
          .get('/name.txt')
          .expect(200, function (err, res) {
            t.error(err)
            request(app)
              .get('/name.txt')
              .set('If-None-Match', '"123"')
              .expect(200, 'tobi', err => t.error(err))
          })
      })

      t.test('should respond with 200 when ETag is not generated', function (t) {
        t.plan(2)

        const app = http.createServer(async function (req, res) {
          const { statusCode, headers, stream } = await send(req, req.url, { etag: false, root: fixtures })
          res.writeHead(statusCode, headers)
          stream.pipe(res)
        })

        request(app)
          .get('/name.txt')
          .expect(200, function (err, res) {
            t.error(err)
            request(app)
              .get('/name.txt')
              .set('If-None-Match', '"123"')
              .expect(200, 'tobi', err => t.error(err))
          })
      })

      t.test('should respond with 306 Not Modified when using wildcard * on existing file', function (t) {
        t.plan(2)

        const app = http.createServer(async function (req, res) {
          const { statusCode, headers, stream } = await send(req, req.url, { etag: false, root: fixtures })
          res.writeHead(statusCode, headers)
          stream.pipe(res)
        })

        request(app)
          .get('/name.txt')
          .expect(200, function (err, res) {
            t.error(err)
            request(app)
              .get('/name.txt')
              .set('If-None-Match', '*')
              .expect(304, '', err => t.error(err))
          })
      })

      t.test('should respond with 404 Not Found when using wildcard * on non-existing file', function (t) {
        t.plan(1)

        const app = http.createServer(async function (req, res) {
          const { statusCode, headers, stream } = await send(req, req.url, { etag: false, root: fixtures })
          res.writeHead(statusCode, headers)
          stream.pipe(res)
        })

        request(app)
          .get('/asdf.txt')
          .set('If-None-Match', '*')
          .expect(404, /Not Found/, err => t.error(err))
      })

      t.test('should respond with 200 cache-control is set to no-cache', function (t) {
        t.plan(2)

        const app = http.createServer(async function (req, res) {
          const { statusCode, headers, stream } = await send(req, req.url, { root: fixtures })
          res.writeHead(statusCode, headers)
          stream.pipe(res)
        })

        request(app)
          .get('/name.txt')
          .expect(200, function (err, res) {
            t.error(err)
            request(app)
              .get('/name.txt')
              .set('If-None-Match', res.headers.etag)
              .set('cache-control', 'no-cache')
              .expect(200, 'tobi', err => t.error(err))
          })
      })
    })

    t.test('where "If-Unmodified-Since" is set', function (t) {
      t.plan(3)

      t.test('should respond with 200 when unmodified', function (t) {
        t.plan(2)

        const app = http.createServer(async function (req, res) {
          const { statusCode, headers, stream } = await send(req, req.url, { root: fixtures })
          res.writeHead(statusCode, headers)
          stream.pipe(res)
        })

        request(app)
          .get('/name.txt')
          .expect(200, function (err, res) {
            t.error(err)
            request(app)
              .get('/name.txt')
              .set('If-Unmodified-Since', res.headers['last-modified'])
              .expect(200, err => t.error(err))
          })
      })

      t.test('should respond with 412 when modified', function (t) {
        t.plan(2)

        const app = http.createServer(async function (req, res) {
          const { statusCode, headers, stream } = await send(req, req.url, { root: fixtures })
          res.writeHead(statusCode, headers)
          stream.pipe(res)
        })

        request(app)
          .get('/name.txt')
          .expect(200, function (err, res) {
            t.error(err)
            const lmod = new Date(res.headers['last-modified'])
            const date = new Date(lmod - 60000).toUTCString()
            request(app)
              .get('/name.txt')
              .set('If-Unmodified-Since', date)
              .expect(412, err => t.error(err))
          })
      })

      t.test('should respond with 200 when invalid date', function (t) {
        t.plan(1)

        const app = http.createServer(async function (req, res) {
          const { statusCode, headers, stream } = await send(req, req.url, { root: fixtures })
          res.writeHead(statusCode, headers)
          stream.pipe(res)
        })

        request(app)
          .get('/name.txt')
          .set('If-Unmodified-Since', 'foo')
          .expect(200, err => t.error(err))
      })
    })
  })

  t.test('with Range request', function (t) {
    t.plan(13)

    t.test('should support byte ranges', function (t) {
      t.plan(1)

      const app = http.createServer(async function (req, res) {
        const { statusCode, headers, stream } = await send(req, req.url, { root: fixtures })
        res.writeHead(statusCode, headers)
        stream.pipe(res)
      })

      request(app)
        .get('/nums.txt')
        .set('Range', 'bytes=0-4')
        .expect(206, '12345', err => t.error(err))
    })

    t.test('should ignore non-byte ranges', function (t) {
      t.plan(1)

      const app = http.createServer(async function (req, res) {
        const { statusCode, headers, stream } = await send(req, req.url, { root: fixtures })
        res.writeHead(statusCode, headers)
        stream.pipe(res)
      })

      request(app)
        .get('/nums.txt')
        .set('Range', 'items=0-4')
        .expect(200, '123456789', err => t.error(err))
    })

    t.test('should be inclusive', function (t) {
      t.plan(1)

      const app = http.createServer(async function (req, res) {
        const { statusCode, headers, stream } = await send(req, req.url, { root: fixtures })
        res.writeHead(statusCode, headers)
        stream.pipe(res)
      })

      request(app)
        .get('/nums.txt')
        .set('Range', 'bytes=0-0')
        .expect(206, '1', err => t.error(err))
    })

    t.test('should set Content-Range', function (t) {
      t.plan(1)

      const app = http.createServer(async function (req, res) {
        const { statusCode, headers, stream } = await send(req, req.url, { root: fixtures })
        res.writeHead(statusCode, headers)
        stream.pipe(res)
      })

      request(app)
        .get('/nums.txt')
        .set('Range', 'bytes=2-5')
        .expect('Content-Range', 'bytes 2-5/9')
        .expect(206, err => t.error(err))
    })

    t.test('should support -n', function (t) {
      t.plan(1)

      const app = http.createServer(async function (req, res) {
        const { statusCode, headers, stream } = await send(req, req.url, { root: fixtures })
        res.writeHead(statusCode, headers)
        stream.pipe(res)
      })

      request(app)
        .get('/nums.txt')
        .set('Range', 'bytes=-3')
        .expect(206, '789', err => t.error(err))
    })

    t.test('should support n-', function (t) {
      t.plan(1)

      const app = http.createServer(async function (req, res) {
        const { statusCode, headers, stream } = await send(req, req.url, { root: fixtures })
        res.writeHead(statusCode, headers)
        stream.pipe(res)
      })

      request(app)
        .get('/nums.txt')
        .set('Range', 'bytes=3-')
        .expect(206, '456789', err => t.error(err))
    })

    t.test('should respond with 206 "Partial Content"', function (t) {
      t.plan(1)

      const app = http.createServer(async function (req, res) {
        const { statusCode, headers, stream } = await send(req, req.url, { root: fixtures })
        res.writeHead(statusCode, headers)
        stream.pipe(res)
      })

      request(app)
        .get('/nums.txt')
        .set('Range', 'bytes=0-4')
        .expect(206, err => t.error(err))
    })

    t.test('should set Content-Length to the # of octets transferred', function (t) {
      t.plan(1)

      const app = http.createServer(async function (req, res) {
        const { statusCode, headers, stream } = await send(req, req.url, { root: fixtures })
        res.writeHead(statusCode, headers)
        stream.pipe(res)
      })

      request(app)
        .get('/nums.txt')
        .set('Range', 'bytes=2-3')
        .expect('Content-Length', '2')
        .expect(206, '34', err => t.error(err))
    })

    t.test('when last-byte-pos of the range is greater the length', function (t) {
      t.plan(2)

      t.test('is taken to be equal to one less than the length', function (t) {
        t.plan(1)

        const app = http.createServer(async function (req, res) {
          const { statusCode, headers, stream } = await send(req, req.url, { root: fixtures })
          res.writeHead(statusCode, headers)
          stream.pipe(res)
        })

        request(app)
          .get('/nums.txt')
          .set('Range', 'bytes=2-50')
          .expect('Content-Range', 'bytes 2-8/9')
          .expect(206, err => t.error(err))
      })

      t.test('should adapt the Content-Length accordingly', function (t) {
        t.plan(1)

        const app = http.createServer(async function (req, res) {
          const { statusCode, headers, stream } = await send(req, req.url, { root: fixtures })
          res.writeHead(statusCode, headers)
          stream.pipe(res)
        })

        request(app)
          .get('/nums.txt')
          .set('Range', 'bytes=2-50')
          .expect('Content-Length', '7')
          .expect(206, err => t.error(err))
      })
    })

    t.test('when the first- byte-pos of the range is greater length', function (t) {
      t.plan(2)

      t.test('should respond with 416', function (t) {
        t.plan(1)

        const app = http.createServer(async function (req, res) {
          const { statusCode, headers, stream } = await send(req, req.url, { root: fixtures })
          res.writeHead(statusCode, headers)
          stream.pipe(res)
        })

        request(app)
          .get('/nums.txt')
          .set('Range', 'bytes=9-50')
          .expect('Content-Range', 'bytes */9')
          .expect(416, err => t.error(err))
      })

      t.test('should emit error 416 with content-range header', function (t) {
        t.plan(1)

        const server = http.createServer(async function (req, res) {
          const { statusCode, headers, stream } = await send(req, req.url, { root: fixtures })
          res.writeHead(statusCode, {
            ...headers,
            'X-Content-Range': headers['Content-Range']
          })
          stream.pipe(res)
        })

        request(server)
          .get('/nums.txt')
          .set('Range', 'bytes=9-50')
          .expect('X-Content-Range', 'bytes */9')
          .expect(416, err => t.error(err))
      })
    })

    t.test('when syntactically invalid', function (t) {
      t.plan(1)

      t.test('should respond with 200 and the entire contents', function (t) {
        t.plan(1)

        const app = http.createServer(async function (req, res) {
          const { statusCode, headers, stream } = await send(req, req.url, { root: fixtures })
          res.writeHead(statusCode, headers)
          stream.pipe(res)
        })

        request(app)
          .get('/nums.txt')
          .set('Range', 'asdf')
          .expect(200, '123456789', err => t.error(err))
      })
    })

    t.test('when multiple ranges', function (t) {
      t.plan(2)

      t.test('should respond with 200 and the entire contents', function (t) {
        t.plan(2)

        const app = http.createServer(async function (req, res) {
          const { statusCode, headers, stream } = await send(req, req.url, { root: fixtures })
          res.writeHead(statusCode, headers)
          stream.pipe(res)
        })

        request(app)
          .get('/nums.txt')
          .set('Range', 'bytes=1-1,3-')
          .expect(shouldNotHaveHeader('Content-Range', t))
          .expect(200, '123456789', err => t.error(err))
      })

      t.test('should respond with 206 is all ranges can be combined', function (t) {
        t.plan(1)

        const app = http.createServer(async function (req, res) {
          const { statusCode, headers, stream } = await send(req, req.url, { root: fixtures })
          res.writeHead(statusCode, headers)
          stream.pipe(res)
        })

        request(app)
          .get('/nums.txt')
          .set('Range', 'bytes=1-2,3-5')
          .expect('Content-Range', 'bytes 1-5/9')
          .expect(206, '23456', err => t.error(err))
      })
    })

    t.test('when if-range present', function (t) {
      t.plan(5)

      t.test('should respond with parts when etag unchanged', function (t) {
        t.plan(2)

        const app = http.createServer(async function (req, res) {
          const { statusCode, headers, stream } = await send(req, req.url, { root: fixtures })
          res.writeHead(statusCode, headers)
          stream.pipe(res)
        })

        request(app)
          .get('/nums.txt')
          .expect(200, function (err, res) {
            t.error(err)
            const etag = res.headers.etag

            request(app)
              .get('/nums.txt')
              .set('If-Range', etag)
              .set('Range', 'bytes=0-0')
              .expect(206, '1', err => t.error(err))
          })
      })

      t.test('should respond with 200 when etag changed', function (t) {
        t.plan(2)

        const app = http.createServer(async function (req, res) {
          const { statusCode, headers, stream } = await send(req, req.url, { root: fixtures })
          res.writeHead(statusCode, headers)
          stream.pipe(res)
        })

        request(app)
          .get('/nums.txt')
          .expect(200, function (err, res) {
            t.error(err)
            const etag = res.headers.etag.replace(/"(.)/, '"0$1')

            request(app)
              .get('/nums.txt')
              .set('If-Range', etag)
              .set('Range', 'bytes=0-0')
              .expect(200, '123456789', err => t.error(err))
          })
      })

      t.test('should respond with parts when modified unchanged', function (t) {
        t.plan(2)

        const app = http.createServer(async function (req, res) {
          const { statusCode, headers, stream } = await send(req, req.url, { root: fixtures })
          res.writeHead(statusCode, headers)
          stream.pipe(res)
        })

        request(app)
          .get('/nums.txt')
          .expect(200, function (err, res) {
            t.error(err)
            const modified = res.headers['last-modified']

            request(app)
              .get('/nums.txt')
              .set('If-Range', modified)
              .set('Range', 'bytes=0-0')
              .expect(206, '1', err => t.error(err))
          })
      })

      t.test('should respond with 200 when modified changed', function (t) {
        t.plan(2)

        const app = http.createServer(async function (req, res) {
          const { statusCode, headers, stream } = await send(req, req.url, { root: fixtures })
          res.writeHead(statusCode, headers)
          stream.pipe(res)
        })

        request(app)
          .get('/nums.txt')
          .expect(200, function (err, res) {
            t.error(err)
            const modified = Date.parse(res.headers['last-modified']) - 20000

            request(app)
              .get('/nums.txt')
              .set('If-Range', new Date(modified).toUTCString())
              .set('Range', 'bytes=0-0')
              .expect(200, '123456789', err => t.error(err))
          })
      })

      t.test('should respond with 200 when invalid value', function (t) {
        t.plan(1)

        const app = http.createServer(async function (req, res) {
          const { statusCode, headers, stream } = await send(req, req.url, { root: fixtures })
          res.writeHead(statusCode, headers)
          stream.pipe(res)
        })

        request(app)
          .get('/nums.txt')
          .set('If-Range', 'foo')
          .set('Range', 'bytes=0-0')
          .expect(200, '123456789', err => t.error(err))
      })
    })
  })

  t.test('when "options" is specified', function (t) {
    t.plan(4)

    t.test('should support start/end', function (t) {
      t.plan(1)

      request(createServer({ root: fixtures, start: 3, end: 5 }))
        .get('/nums.txt')
        .expect(200, '456', err => t.error(err))
    })

    t.test('should adjust too large end', function (t) {
      t.plan(1)

      request(createServer({ root: fixtures, start: 3, end: 90 }))
        .get('/nums.txt')
        .expect(200, '456789', err => t.error(err))
    })

    t.test('should support start/end with Range request', function (t) {
      t.plan(1)

      request(createServer({ root: fixtures, start: 0, end: 2 }))
        .get('/nums.txt')
        .set('Range', 'bytes=-2')
        .expect(206, '23', err => t.error(err))
    })

    t.test('should support start/end with unsatisfiable Range request', function (t) {
      t.plan(1)

      request(createServer({ root: fixtures, start: 0, end: 2 }))
        .get('/nums.txt')
        .set('Range', 'bytes=5-9')
        .expect('Content-Range', 'bytes */3')
        .expect(416, err => t.error(err))
    })
  })
})

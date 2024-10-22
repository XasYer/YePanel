# @fastify/send

![CI](https://github.com/fastify/send/workflows/CI/badge.svg)
[![NPM version](https://img.shields.io/npm/v/@fastify/send.svg?style=flat)](https://www.npmjs.com/package/@fastify/send)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://standardjs.com/)

Send is a library for streaming files from the file system as an HTTP response
supporting partial responses (Ranges), conditional-GET negotiation (If-Match,
If-Unmodified-Since, If-None-Match, If-Modified-Since), high test coverage,
and granular events which may be leveraged to take appropriate actions in your
application or framework.

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/). Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```bash
$ npm install @fastify/send
```

### TypeScript

`@types/mime@3` must be used if wanting to use TypeScript;
`@types/mime@4` removed the `mime` types.

```bash
$ npm install -D @types/mime@3
```

## API

```js
var send = require('@fastify/send')
```

### send(req, path, [options])

Provide `statusCode`, `headers` and `stream` for the given path to send to a
`res`. The `req` is the Node.js HTTP request and the `path `is a urlencoded path
to send (urlencoded, not the actual file-system path).

#### Options

##### acceptRanges

Enable or disable accepting ranged requests, defaults to true.
Disabling this will not send `Accept-Ranges` and ignore the contents
of the `Range` request header.

##### cacheControl

Enable or disable setting `Cache-Control` response header, defaults to
true. Disabling this will ignore the `immutable` and `maxAge` options.

##### dotfiles

Set how "dotfiles" are treated when encountered. A dotfile is a file
or directory that begins with a dot ("."). Note this check is done on
the path itself without checking if the path exists on the
disk. If `root` is specified, only the dotfiles above the root are
checked (i.e. the root itself can be within a dotfile when set
to "deny").

  - `'allow'` No special treatment for dotfiles.
  - `'deny'` Send a 403 for any request for a dotfile.
  - `'ignore'` Pretend like the dotfile does not exist and 404.

The default value is _similar_ to `'ignore'`, with the exception that
this default will not ignore the files within a directory that begins
with a dot, for backward-compatibility.

##### end

Byte offset at which the stream ends, defaults to the length of the file
minus 1. The end is inclusive in the stream, meaning `end: 3` will include
the 4th byte in the stream.

##### etag

Enable or disable etag generation, defaults to true.

##### extensions

If a given file doesn't exist, try appending one of the given extensions,
in the given order. By default, this is disabled (set to `false`). An
example value that will serve extension-less HTML files: `['html', 'htm']`.
This is skipped if the requested file already has an extension.

##### immutable

Enable or disable the `immutable` directive in the `Cache-Control` response
header, defaults to `false`. If set to `true`, the `maxAge` option should
also be specified to enable caching. The `immutable` directive will prevent
supported clients from making conditional requests during the life of the
`maxAge` option to check if the file has changed.

##### index

By default send supports "index.html" files, to disable this
set `false` or to supply a new index pass a string or an array
in preferred order.

##### lastModified

Enable or disable `Last-Modified` header, defaults to true. Uses the file
system's last modified value.

##### maxAge

Provide a max-age in milliseconds for HTTP caching, defaults to 0.
This can also be a string accepted by the
[ms](https://www.npmjs.org/package/ms#readme) module.

##### root

Serve files relative to `path`.

##### start

Byte offset at which the stream starts, defaults to 0. The start is inclusive,
meaning `start: 2` will include the 3rd byte in the stream.

### .mime

The `mime` export is the global instance of the
[`mime` npm module](https://www.npmjs.com/package/mime).

This is used to configure the MIME types that are associated with file extensions
as well as other options for how to resolve the MIME type of a file (like the
default type to use for an unknown file extension).

## Caching

It does _not_ perform internal caching, you should use a reverse proxy cache
such as Varnish for this, or those fancy things called CDNs. If your
application is small enough that it would benefit from single-node memory
caching, it's small enough that it does not need caching at all ;).

## Debugging

To enable `debug()` instrumentation output export __NODE_DEBUG__:

```
$ NODE_DEBUG=send node app
```

## Running tests

```
$ npm install
$ npm test
```

## Examples

### Serve a specific file

This simple example will send a specific file to all requests.

```js
var http = require('node:http')
var send = require('send')

var server = http.createServer(async function onRequest (req, res) {
  const { statusCode, headers, stream } = await send(req, '/path/to/index.html')
  res.writeHead(statusCode, headers)
  stream.pipe(res)
})

server.listen(3000)
```

### Serve all files from a directory

This simple example will just serve up all the files in a
given directory as the top-level. For example, a request
`GET /foo.txt` will send back `/www/public/foo.txt`.

```js
var http = require('node:http')
var parseUrl = require('parseurl')
var send = require('@fastify/send')

var server = http.createServer(async function onRequest (req, res) {
  const { statusCode, headers, stream } = await send(req, parseUrl(req).pathname, { root: '/www/public' })
  res.writeHead(statusCode, headers)
  stream.pipe(res)
})

server.listen(3000)
```

### Custom file types

```js
var http = require('node:http')
var parseUrl = require('parseurl')
var send = require('@fastify/send')

// Default unknown types to text/plain
send.mime.default_type = 'text/plain'

// Add a custom type
send.mime.define({
  'application/x-my-type': ['x-mt', 'x-mtt']
})

var server = http.createServer(function onRequest (req, res) {
  const { statusCode, headers, stream } = await send(req, parseUrl(req).pathname, { root: '/www/public' })
  res.writeHead(statusCode, headers)
  stream.pipe(res)
})

server.listen(3000)
```

### Custom directory index view

This is an example of serving up a structure of directories with a
custom function to render a listing of a directory.

```js
var http = require('node:http')
var fs = require('node:fs')
var parseUrl = require('parseurl')
var send = require('@fastify/send')

// Transfer arbitrary files from within /www/example.com/public/*
// with a custom handler for directory listing
var server = http.createServer(async function onRequest (req, res) {
  const { statusCode, headers, stream, type, metadata } = await send(req, parseUrl(req).pathname, { index: false, root: '/www/public' })
  if(type === 'directory') {
    // get directory list
    const list = await readdir(metadata.path)
    // render an index for the directory
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=UTF-8' })
    res.end(list.join('\n') + '\n')
  } else {
    res.writeHead(statusCode, headers)
    stream.pipe(res)
  }
})

server.listen(3000)
```

### Serving from a root directory with custom error-handling

```js
var http = require('node:http')
var parseUrl = require('parseurl')
var send = require('@fastify/send')

var server = http.createServer(async function onRequest (req, res) {
  // transfer arbitrary files from within
  // /www/example.com/public/*
  const { statusCode, headers, stream, type, metadata } = await send(req, parseUrl(req).pathname, { root: '/www/public' })
  switch (type) {
    case 'directory': {
      // your custom directory handling logic:
      res.writeHead(301, {
        'Location': metadata.requestPath + '/'
      })
      res.end('Redirecting to ' + metadata.requestPath + '/')
      break
    }
    case 'error': {
      // your custom error-handling logic:
      res.writeHead(metadata.error.status ?? 500, {})
      res.end(metadata.error.message)
      break
    }
    default: {
      // your custom headers
      // serve all files for download
      res.setHeader('Content-Disposition', 'attachment')
      res.writeHead(statusCode, headers)
      stream.pipe(res)
    }
  }
})

server.listen(3000)
```

## License

[MIT](LICENSE)

# @fastify/accept-negotiator


[![CI](https://github.com/fastify/accept-negotiator/workflows/CI/badge.svg)](https://github.com/fastify/accept-negotiator/actions/workflows/ci.yml)
[![NPM version](https://img.shields.io/npm/v/@fastify/accept-negotiator.svg?style=flat)](https://www.npmjs.com/package/@fastify/accept-negotiator)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://standardjs.com/)

A negotiator for the accept-headers

### Install
```
npm i @fastify/accept-negotiator
```

### Usage

The module exports a function that you can use for negotiating an accept-header, e.g. accept-encoding. It takes 2 parameters:

```
negotiate(header, supportedValues)
```

- `header` (`string`, required) - The accept-header, e.g. accept-encoding
- `supportedValues` (`string[]`, required) - The values, which are supported

```js
const negotiate = require('@fastify/accept-negotiator').negotiate
const encoding = negotiate('gzip, deflate, br', ['br'])
console.log(encoding) // 'br*
```

The module also exports a class that you can use for negotiating an accept-header, e.g. accept-encoding, and use caching for better performance.


```
Negotiate(supportedValues)
```

- `supportedValues` (`string[]`, required) - The values, which are supported
- `cache` (`{ set: Function; get: Function; has: Function }`, optional) - A Cache-Store, e.g. ES6-Map or mnemonist LRUCache

```js
const Negotiator = require('@fastify/accept-negotiator').Negotiator
const encodingNegotiator = new Negotiator({ supportedValues: ['br'], cache: new Map() })

const encoding = encodingNegotiator.negotiate('gzip, deflate, br')
console.log(encoding) // 'br*
```

## License

Licensed under [MIT](./LICENSE).

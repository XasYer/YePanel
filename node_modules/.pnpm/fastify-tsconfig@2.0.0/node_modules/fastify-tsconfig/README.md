# tsconfig

> Shared [TypeScript configuration](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) for fastify projects

## Install

```
$ npm install --save-dev fastify-tsconfig
```

## Usage

Create your own `tsconfig.json` in the projects' root folder and extend it from `fastify-tsconfig`, overriding or adding the desired settings. By default, no `outDir` is set (because of [this issue](https://github.com/Microsoft/TypeScript/issues/29172)), so be sure to add one.

### Configuration module and moduleResolution

This configuration sets `"module"` and `"moduleResolution"` to [`NodeNext`](https://www.typescriptlang.org/docs/handbook/esm-node.html). This means that TypeScript will read the nearest `package.json` file in the scope and search for the `"type"` field or the absence of it.

If `type` is not set or is `"type": "commonjs"` the emitted code will be CommonJS, with `.js` extension. Moreover, `tsc` will complain if ESM-only properties/features are used in source files. If you want to emit `.mjs` files, use the `.mts` extension.
On the other hand, if `"type": "module"` is set, the sources will be compiled to the ESM with the `.js` extension. In this case, if you want to emit `.cjs` files, use the `.cts` extension for the source file.

The "following the Node.js rules" goes also for the `package.json` `exports` field. If `type` is set, regardless of the value, TypeScript will check the `exports` field to know where the compiled code and the types are located. If the `type` field is not set, it will check for the `main` and `types` fields.

#### CommonJS example
`package.json`
```jsonc
{
  "name": "my-package",
  "type": "commonjs",
  "main": "dist/index.js", // this is for older Node.js versions
  "types": "dist/index.d.ts", // this is optional and can be omitted
  "exports": {
    "import": "./dist/index.js",
    "require": "./dist/index.js",
    "types": "./dist/index.d.ts" // this is optional and can be omitted
 }
}
```
`tsconfig.json`
```jsonc
{
 "extends": "fastify-tsconfig",
 "compilerOptions": {
    "outDir": "dist",
    "sourceMap": true
  },
  "include": [
    "src/**/*.ts"
  ]
}
```
#### ESM example
`package.json`
```jsonc
{
  "name": "my-package",
  "type": "module",
  "main": "dist/index.js", // this is for older Node.js versions
  "types": "dist/index.d.ts", // this is optional and can be omitted
  "exports": {
    "import": "./dist/index.js",
    "require": "./dist/index.js",
    "types": "./dist/index.d.ts" // this is optional and can be omitted
 }
}
```
`tsconfig.json`
```jsonc
{
 "extends": "fastify-tsconfig",
 "compilerOptions": {
    "outDir": "dist",
    "sourceMap": true
  },
  "include": [
    "src/**/*.ts"
  ]
}
```
### Extending this configuration

Depending on the type of the project, you should add the following settings.

#### Application
`tsconfig.json`
```json
{
 "extends": "fastify-tsconfig",
 "compilerOptions": {
    "outDir": "dist",
    "sourceMap": true
 },
 "include": [
    "src/**/*.ts"
 ]
}
```
#### NPM Package
`tsconfig.json`

```json
{
 "extends": "fastify-tsconfig",
 "compilerOptions": {
    "outDir": "dist",
    "declaration": true
 },
 "include": [
    "src/**/*.ts"
 ]
}
```
#### Monorepo Package
`tsconfig.json`

```json
{
 "extends": "fastify-tsconfig",
 "compilerOptions": {
    "outDir": "dist",
    "declarationMap": true,
    "composite": true
 },
 "include": [
    "src/**/*.ts"
 ]
}
```

Check the other settings [here](./tsconfig.json)

## Configuration target

The configuration targets ES2022, which is supported in Node.js 16 and later. Only one feature still needs to be implemented: [RegExp Match Indices shows up in flags](https://node.green/#ES2022). However, using ES2022 as a target makes widely used features not being compiled. To target an older version, override the `target` property.

## License

Licensed under [MIT](./LICENSE).

---

Inspired by: [sindresorhus/tsconfig](https://github.com/sindresorhus/tsconfig)


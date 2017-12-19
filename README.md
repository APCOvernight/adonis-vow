
# Adonis Vow Mocha

Mocha Test runner for Adonis framework


[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Coveralls][coveralls-image]][coveralls-url]

Fork of [Adonis Vow test runner](https://github.com/adonisjs/adonis-vow) for Adonis framework combined with [Mocha](https://mochajs.org), just install and register the provider and BOOM it works with your mocha BDD tests.

## Setup

```bash
npm install --save-dev adonis-vow-mocha
```

## Register provider

The provider must be registered as an `aceProvider`, since there is no point in loading test runner when running your app.


```js
const aceProviders = [
  'adonis-vow-mocha/providers/VowMochaProvider'
]
```

## Run tests
That's all you really need to do in order to get up and running. Now you can run mocha tests in `test/unit`, `test/integration` and `test/functional` by executing following command.

```bash
adonis test
```

For help, run. Most command options from [Adonis Vow](https://github.com/adonisjs/adonis-vow) have been ported over.

```bash
adonis test --help
```

## Before and After hooks

To perform actions before and after all tests have completed (e.g. start and stop the test server for functional testing) add a `hooks.js` in `/test`. See an example of this in [templates/hooks.js](templates/hooks.js)

## Environment files

The vow provider attempts to load the `.env.test` file when running tests. Any variables placed inside this file will override the actual variables.

Spec is the default reporter but you can define your own with the `REPORTER` env variable.

### Development

The tests for the test runner are written using [japa](https://github.com/thetutlage/japa) and make sure to go through the docs.

[npm-image]: https://img.shields.io/npm/v/adonis-vow-mocha.svg?style=flat-square
[npm-url]: https://npmjs.org/package/adonis-vow-mocha

[travis-image]: https://img.shields.io/travis/APCOvernight/adonis-vow-mocha/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/APCOvernight/adonis-vow-mocha

[coveralls-image]: https://img.shields.io/coveralls/APCOvernight/adonis-vow-mocha/master.svg?style=flat-square

[coveralls-url]: https://coveralls.io/github/APCOvernight/adonis-vow-mocha

'use strict'

/*
 * adonis-vow
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const test = require('japa')
const { setupResolver, Env, Config } = require('@adonisjs/sink')
const { ioc } = require('@adonisjs/fold')
const mock = require('mock-require')
const assert = require('assert')

class MochaMock {
  constructor (opts) {
    assert(typeof opts === 'object')
  }

  addFile (filename) {
    assert(typeof cb === 'string')
  }

  run (cb) {
    assert(typeof cb === 'function')
  }
}

mock('mocha', MochaMock)

const Runner = require('../../src/Runner')
const props = require('../../lib/props')

test.group('Runner', (group) => {
  group.before(() => {
    setupResolver()
    ioc.fake('Adonis/Src/Config', () => {
      return new Config()
    })
  })

  group.beforeEach(() => {
    const env = new Env()
    env.set('REPORTER', 'spec')
    this.runner = new Runner(env)
  })

  test('define global timeout for all tests', (assert) => {
    this.runner.timeout(1000)
    assert.equal(props.timeout, 1000)
  })

  test('clear props', (assert) => {
    this.runner.timeout(1000)
    assert.equal(props.timeout, 1000)
    this.runner.clear()
    assert.equal(props.timeout, 2000)
  })

  test('run tests using mocha runner', async () => {
    await this.runner.run([])
  })

  test('set bail status on runner', async (assert) => {
    this.runner.bail(true)
    assert.isTrue(props.bail)
  })
})

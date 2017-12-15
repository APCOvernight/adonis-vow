'use strict'

/*
 * adonis-vow
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const Mocha = require('mocha')
const pSeries = require('p-series')
const { resolver } = require('@adonisjs/fold')
const debug = require('debug')('adonis:vow:runner')

const props = require('../../lib/props')

/**
 * Test runner is used to run the test using
 * Adonisjs cli.
 *
 * @class TestRunner
 * @static
 */
class TestRunner {
  constructor (Env) {
    this.clear()
    this._reporter = Env.get('REPORTER', 'spec')
  }

  /**
   * Executes the stack of promises before or
   * after running the tests
   *
   * @method _executedRunnerStack
   *
   * @param  {String}             event
   *
   * @return {Promise}
   *
   * @private
   */
  _executedRunnerStack (event) {
    return pSeries(this._stack[event])
  }

  /**
   * Runs all traits attached to a suite
   *
   * @method _runTraits
   *
   * @param  {Object}   suite
   *
   * @return {void}
   *
   * @private
   */
  _runTraits (suite) {
    debug('running %d trait(s) for %s suite', suite.traits.length, suite.group._title)
    suite.traits.forEach((trait) => {
      const resolvedTrait = typeof (trait.action) === 'function'
      ? trait.action
      : resolver.resolve(trait.action)

      /**
       * If resolved trait is a class with handle
       * method on it
       */
      if (resolvedTrait.handle) {
        return resolvedTrait.handle(suite, trait.options)
      }

      /**
       * Otherwise trait is a closure
       */
      resolvedTrait(suite, trait.options)
    })
  }

  /**
   * Clear properties of runner.
   *
   * @method clear
   *
   * @return {void}
   */
  clear () {
    props.grep = null
    props.timeout = 2000
    props.bail = false
    this.executedStack = false
    this._stack = {
      before: [],
      after: []
    }
    this._suites = []
  }

  /**
   * Add global timeout for all the tests
   *
   * @method timeout
   *
   * @param  {Number} timeout
   *
   * @chainable
   */
  timeout (timeout) {
    debug('setting global timeout as %s', timeout)
    props.timeout = timeout
    return this
  }

  /**
   * Exit early when tests fails
   *
   * @method bail
   *
   * @param  {Boolean} state
   *
   * @chainable
   */
  bail (state) {
    debug('toggling bail status to %s', state)
    props.bail = state
    return this
  }

  /**
   * Add grep term to filter the tests.
   *
   * @method grep
   *
   * @param  {String} term
   *
   * @chainable
   */
  grep (term) {
    debug('setting runner grep term as %s', term)
    props.grep = term
    return this
  }

  /**
   * A series of actions to be executed before
   * executing any of the tests
   *
   * @method before
   *
   * @param  {Function} callback
   *
   * @chainable
   */
  before (callback) {
    this._stack.before.push(callback)
    return this
  }

  /**
   * A series of actions to be executed after
   * executing all of the tests.
   *
   * @method after
   *
   * @param  {Function} callback
   *
   * @chainable
   */
  after (callback) {
    this._stack.after.push(callback)
    return this
  }

  /**
   * Create and run new mocha instance
   *
   * @method run
   *
   * @param {Array} testFiles List of filenames to pass to mocha
   *
   * @return {Promise}
   */
  async run (testFiles) {
    const mocha = new Mocha({
      ui: 'bdd',
      timeout: props.timeout,
      bail: props.bail,
      reporter: this._reporter
    })

    testFiles.forEach(mocha.addFile.bind(mocha))

    return mocha.run(failures => {
      use('Database').close()
      process.on('exit', function () {
        process.exit(failures)  // exit with non-zero status if there were failures
      })
    })
  }

  /**
   * Set a custom event emitter to listen for test
   * status
   *
   * @method emitter
   *
   * @param  {Object} emitter
   *
   * @chainable
   */
  emitter (emitter) {
    props.emitter = emitter
    return this
  }
}

module.exports = TestRunner

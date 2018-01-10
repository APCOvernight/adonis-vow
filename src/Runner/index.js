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
    this.beforeHook = () => {}
    this.afterHook = () => {}
    this._reporter = Env.get('REPORTER', 'spec')
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
  async before (callback) {
    this.beforeHook = callback
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
  async after (callback) {
    this.afterHook = callback
    return this
  }

  /**
   * Clear properties of runner.
   *
   * @method clear
   *
   * @return {void}
   */
  clear () {
    props.timeout = 2000
    props.bail = false
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

    await this.beforeHook()

    return mocha.run(async failures => {
      try {
        // If database is open close it
        use('Database').close()
      } catch (e) {}

      await this.afterHook()

      process.on('exit', function () {
        process.exit(failures)  // exit with non-zero status if there were failures
      })
    })
  }
}

module.exports = TestRunner

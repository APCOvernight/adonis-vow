'use strict'

/*
 * adonis-vow
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

let DEFAULT_TIMEOUT = 2000
let BAIL_TESTS = false

module.exports = {
  get timeout () {
    return DEFAULT_TIMEOUT
  },

  set timeout (timeout) {
    DEFAULT_TIMEOUT = timeout
  },

  get bail () {
    return BAIL_TESTS
  },

  set bail (state) {
    BAIL_TESTS = !!state
  }
}

'use strict'

function _typeof (obj) { '@babel/helpers - typeof'; if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') { _typeof = function _typeof (obj) { return typeof obj } } else { _typeof = function _typeof (obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj } } return _typeof(obj) }

require('core-js/modules/es.object.assign')

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.default = void 0

require('core-js/stable')

var arrayHelpers = _interopRequireWildcard(require('./helpers/arrays'))

var functionHelpers = _interopRequireWildcard(require('./helpers/functions'))

var numberHelpers = _interopRequireWildcard(require('./helpers/numbers'))

var objectHelpers = _interopRequireWildcard(require('./helpers/objects'))

function _getRequireWildcardCache () { if (typeof WeakMap !== 'function') return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache () { return cache }; return cache }

function _interopRequireWildcard (obj) { if (obj && obj.__esModule) { return obj } if (obj === null || _typeof(obj) !== 'object' && typeof obj !== 'function') { return { default: obj } } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj) } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc) } else { newObj[key] = obj[key] } } } newObj.default = obj; if (cache) { cache.set(obj, newObj) } return newObj }

/**
 * All of the functionalHelpers system functions for stringing together functions and simplifying logic.
 * @file
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 * @module functionalHelpers
 */

/**
   * Store a reference to this scope which will be Window if rendered via browser
   */
var root = void 0 || {}
/**
   * Store reference to any pre-existing module of the same name
   * @type {module|*}
   */

var previousFunctionalHelpers = root.functionalHelpers || {}
/**
   * All methods exported from this module are encapsulated within functionalHelpers.
   * @author Joshua Heagle <joshuaheagle@gmail.com>
   * @typedef {Object} functionalHelpers
   * @module functionalHelpers
   */

var functionalHelpers = {}
root.functionalHelpers = functionalHelpers
/**
   * Return a reference to this library while preserving the original same-named library
   * @function noConflict
   * @returns {functionalHelpers}
   */

functionalHelpers.noConflict = function () {
  root.functionalHelpers = previousFunctionalHelpers
  return functionalHelpers
}

var _default = Object.assign(functionalHelpers, arrayHelpers, functionHelpers, numberHelpers, objectHelpers)

exports.default = _default

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

;
(function () {
  /**
   * @file All of the arrayHelpers system functions for stringing together functions and simplifying logic.
   * @author Joshua Heagle <joshuaheagle@gmail.com>
   * @version 1.0.0
   */

  /**
   * All methods exported from this module are encapsulated within arrayHelpers.
   * @author Joshua Heagle <joshuaheagle@gmail.com>
   * @typedef {Object} arrayHelpers
   * @module arrayHelpers
   */
  var arrayHelpers = {};
  /**
   * Generate an array filled with a copy of the provided item or references to the provided item.
   * The length defines how long the array should be.
   * WARNING: This is a recursive function.
   * @param {boolean} useReference - Choose to multiply by clone or reference, true is by reference
   * @param {*} item - The item to be used for each array element
   * @param {number} length - The desired length of the array
   * @param {Array} [arr=[]] - The in-progress array of elements to be built and returned, will be used internally
   * @returns {Array.<*>}
   */

  var buildArrayBase = function buildArrayBase(useReference, item, length) {
    var arr = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
    item = useReference ? item : cloneObject(item);
    return --length > 0 ? buildArrayBase(useReference, item, length, arr.concat([item])) : arr.concat([item]);
  };
  /**
   * Leverage buildArrayBase to generate an array filled with a copy of the provided item.
   * The length defines how long the array should be.
   * @function buildArray
   * @param {*} item - The item to be used for each array element
   * @param {number} length - The desired length of the array
   * @param {Array} [arr=[]] - The in-progress array of elements to be built and returned, will be used internally
   * @returns {Array.<*>}
   */


  var buildArray = curry(buildArrayBase)(false);
  arrayHelpers.buildArray = buildArray;
  /**
   * Leverage buildArrayBase to generate an array filled with references to the provided item.
   * The length defines how long the array should be.
   * @function buildArrayOfReferences
   * @param {*} item - The item to be used for each array element
   * @param {number} length - The desired length of the array
   * @param {Array} [arr=[]] - The in-progress array of elements to be built and returned, will be used internally
   * @returns {Array.<*>}
   */

  var buildArrayOfReferences = curry(buildArrayBase)(true);
  arrayHelpers.buildArrayOfReferences = buildArrayOfReferences;
  /**
   * Remove duplicate values from an array.
   * @function uniqueArray
   * @param {Array} array - The array to make unique
   * @returns {Array}
   */

  var uniqueArray = function uniqueArray(array) {
    return array.filter(function (item, index) {
      return array.indexOf(item) === index;
    });
  };

  arrayHelpers.uniqueArray = uniqueArray;
  /**
   * Take multiple arrays and then filter all these into one unique array.
   * @function uniqueArray
   * @param {...Array} arrays - Provide mulitple arrays to create one unique array
   * @returns {Array}
   */

  var mergeArrays = function mergeArrays() {
    for (var _len = arguments.length, arrays = new Array(_len), _key = 0; _key < _len; _key++) {
      arrays[_key] = arguments[_key];
    }

    return arrays.map(arrayHelpers.uniqueArray).reduce(function (merged, arr) {
      return [].concat(_toConsumableArray(merged), _toConsumableArray(arr.filter(function (attr) {
        return !merged.includes(attr);
      })));
    }, []);
  };

  arrayHelpers.mergeArrays = mergeArrays;
  /**
   * Compare two Arrays and return the Object where the value for each property is as follows:
   * -1 to indicate val1 is less than val2
   * 0 to indicate both values are the equal
   * 1 to indicate val1 is greater than val2
   * The returned Object uses the element values as the property names
   * This functions works by first creating a concatenated array of all unique values. Then for each unique values,
   * convert to a string and use it as a new property name. Array filter each array checking if it has the unique value.
   * Use the lengths of these filtered arrays to compare. So if the first array has the value and the second one doesn't
   * the first length will be one or more and the second will be zero, if the both have the value then both will be one
   * or more.
   * @example
   * // example of input and resulting output
   * arrayHelpers.compareArrays(
   *   ['match1', 'firstMismatch1', 'match2', 'firstMismatch2', 'badMatch1'],
   *   ['match1', 'match2', 'secondMismatch1', 'badMatch1', 'badMatch1']
   * )
   * // unique array
   * ['match1', 'firstMismatch1', 'match2', 'firstMismatch2', 'badMatch1', 'secondMismatch1']
   * // result object
   * [
   *   {
   *     value: 'match1',
   *     result: [0, 0]
   *   },
   *   {
   *     value: 'firstMismatch1',
   *     result: [1, -1]
   *   },
   *   {
   *     value: 'match2',
   *     result: [0, 0]
   *   },
   *   {
   *     value: 'firstMismatch2',
   *     result: [1, -1]
   *   },
   *   {
   *     value: 'badMatch1',
   *     result: [0, 0]
   *   },
   *   {
   *     value: 'secondMismatch1',
   *     result: [-1, 1]
   *   }
   * ]
   *
   * @function compareArrays
   * @param {Array} arr1 - The first array to compare
   * @param {Array} arr2 - The second array to compare
   * @returns {Object.<string, number>}
   */

  var compareArrays = function compareArrays() {
    for (var _len2 = arguments.length, arrays = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      arrays[_key2] = arguments[_key2];
    }

    return arrayHelpers.mergeArrays.apply(arrayHelpers, arrays).reduce(function (results, attr) {
      var arrayResults = arrays.map(function (array) {
        return array.includes(attr) ? 1 : -1;
      });
      return [].concat(_toConsumableArray(results), [{
        value: attr,
        result: arrayResults.every(function (result) {
          return result === 1;
        }) ? arrayResults.map(function (result) {
          return 0;
        }) : arrayResults
      }]);
    }, []);
  };

  arrayHelpers.compareArrays = compareArrays;
  this.arrayHelpers = arrayHelpers;
}).call(this);
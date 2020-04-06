/**
 * @file All of the functionalHelpers system functions for stringing together functions and simplifying logic.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
;(() => {
  /**
   * Store a reference to this scope which will be Window if rendered via browser
   */
  const root = this || {}

  /**
   * Store reference to any pre-existing module of the same name
   * @type {module|*}
   */
  const previousFunctionalHelpers = root.functionalHelpers || {}

  /**
   * All methods exported from this module are encapsulated within functionalHelpers.
   * @author Joshua Heagle <joshuaheagle@gmail.com>
   * @typedef {Object} functionalHelpers
   * @module core/core
   */
  const functionalHelpers = {}
  root.functionalHelpers = functionalHelpers

  /**
   * Return a reference to this library while preserving the original same-named library
   * @function noConflict
   * @returns {functionalHelpers}
   */
  functionalHelpers.noConflict = () => {
    root.functionalHelpers = previousFunctionalHelpers
    return functionalHelpers
  }

  /**
   * Return a curried version of the passed function.
   * The returned function expects the same number of arguments minus the ones provided.
   * fn is the name of the function being curried.
   * @function curry
   * @param {function} fn - Receives a function to be curried
   * @returns {function(...[*]): function(...[*])}
   */
  functionalHelpers.curry = fn => (...args) => args.length >= fn.length
    ? fn(...args)
    : (...a) => functionalHelpers.curry(fn)(...[...args, ...a])

  /**
   * Take one or more function with a single parameter and return value.
   * Pass a paramter and the value will be transformed by each function then returned.
   * @function pipe
   * @param {...function} fns - Takes a series of functions having the same parameter
   * @returns {function(*=): (*|any)}
   */
  functionalHelpers.pipe = (...fns) => x => fns.reduce((y, f) => f(y), x)

  /**
   * Given a function, call with the correct number of paramters from an array of possible parameters.
   * @function callWithParams
   * @param {function} fn
   * @param {Array} params
   * @param {number} [minimum]
   * @returns {*}
   */
  functionalHelpers.callWithParams = (fn, params = [], minimum = 2) =>
    fn(...params.slice(0, fn.length || minimum))

  /**
   * Set a value on an item, then return the item
   * @function setValue
   * @param {string|number} key - The key on the item which will have its value set
   * @param {*} value - Any value to be applied to the key
   * @param {Object|Array} item - An object or array to be updated
   * @returns {Object|Array}
   */
  functionalHelpers.setValue = (key, value, item) => {
    item[key] = value
    return item
  }

  /**
   * Set a value on an item, then return the value
   * @function setAndReturnValue
   * @param {Object|Array} item - An object or array to be updated
   * @param {string|number} key - The key on the item which will have its value set
   * @param {*} value - Any value to be applied to the key
   * @returns {*}
   */
  functionalHelpers.setAndReturnValue = (item, key, value) => {
    item[key] = value
    return value
  }

  /**
   * Function that produces a property of the new Object, taking three arguments
   * @callback module:core/core~mapCallback
   * @param {*} currentProperty - The current property being processed in the object.
   * @param {string} [currentIndex] - The property name of the current property being processed in the object.
   * @param {Object|Array} [object] - The object map was called upon.
   * @returns {*}
   */

  /**
   * This function is intended to replicate behaviour of the Array.map() function but for Objects.
   * If an array is passed in instead then it will perform standard map(). It is recommended to
   * always use the standard map() function when it is known that the object is actually an array.
   * @function mapObject
   * @param {Object|Array} obj - The Object (or Array) to be mapped
   * @param {module:core/core~mapCallback|function} fn - The function to be processed for each mapped property
   * @param {Object|Array} [thisArg] - Optional. Value to use as this when executing callback.
   * @returns {Object|Array}
   */
  functionalHelpers.mapObject = (obj, fn, thisArg = undefined) => Array.isArray(obj)
    ? obj.map(fn, thisArg)
    : Object.keys(obj).reduce(
      (newObj, curr) => functionalHelpers.setValue(
        curr,
        functionalHelpers.callWithParams(fn, [obj[curr], curr, obj], 2),
        newObj
      ),
      thisArg || {}
    )

  /**
   * Perform map on an array property of an object, then return the object
   * @function mapArrayProperty
   * @param {string} property - The string key for the array property to be mapped
   * @param {module:core/core~mapCallback|function} mapFunction - A function suitable to be passed to map
   * @param {Object|Array} obj - An object having an array property
   * @returns {object}
   */
  functionalHelpers.mapProperty = (property, mapFunction, obj) => {
    obj[property] = functionalHelpers.mapObject(obj[property] || [], mapFunction)
    return obj
  }

  /**
   * Function is a predicate, to test each property value of the object. Return true to keep the element, false
   * otherwise, taking three arguments
   * @callback module:core/core~filterCallback
   * @param {*} currentProperty - The current property being processed in the object.
   * @param {string} [currentIndex] - The property name of the current property being processed in the object.
   * @param {Object|Array} [object] - The object filter was called upon.
   * @returns {boolean}
   */

  /**
   * This function is intended to replicate behaviour of the Array.filter() function but for Objects.
   * If an array is passed in instead then it will perform standard filter(). It is recommended to
   * always use the standard filter() function when it is known that the object is actually an array.
   * @function filterObject
   * @param {Object|Array} obj - The Object (or Array) to be filtered
   * @param {module:core/core~filterCallback|function} fn - The function to be processed for each filtered property
   * @param {Object|Array} [thisArg] - Optional. Value to use as this when executing callback.
   * @returns {Object|Array}
   */
  functionalHelpers.filterObject = (obj, fn, thisArg = undefined) => Array.isArray(obj)
    ? obj.filter(fn, thisArg)
    : Object.keys(obj).reduce((newObj, curr) => {
      if (functionalHelpers.callWithParams(fn, [obj[curr], curr, obj], 2)) {
        newObj[curr] = obj[curr]
      } else {
        delete newObj[curr]
      }
      return newObj
    }, thisArg || {})

  /**
   * Function to execute on each property in the object, taking four arguments
   * @callback module:core/core~reduceCallback
   * @param {*} [accumulator={}] - The accumulator accumulates the callback's return values; it is the accumulated
   * value previously returned in the last invocation of the callback, or initialValue, if supplied (see below).
   * @param {*} [currentProperty={}] - The current property being processed in the object.
   * @param {string} [currentIndex=0] - The index of the current element being processed in the array. Starts at index
   * 0, if an initialValue is provided, and at index 1 otherwise.
   * @param {Object|Array} [object={}] - The object reduce was called upon.
   * @returns {*}
   */

  /**
   * This function is intended to replicate behaviour of the Array.reduce() function but for Objects.
   * If an array is passed in instead then it will perform standard reduce(). It is recommended to
   * always use the standard reduce() function when it is known that the object is actually an array.
   * @function reduceObject
   * @param {Object|Array} obj - The Object (or Array) to be filtered
   * @param {module:core/core~reduceCallback|function} fn - The function to be processed for each filtered property
   * @param {Object|Array} [initialValue] - Optional. Value to use as the first argument to the first call of the
   * callback. If no initial value is supplied, the first element in the array will be used. Calling reduce on an empty
   * array without an initial value is an error.
   * @returns {Object|Array}
   */
  functionalHelpers.reduceObject = (obj, fn, initialValue = obj[Object.keys(obj)[0]] || obj[0]) => Array.isArray(obj)
    ? obj.reduce(fn, initialValue)
    : Object.keys(obj).reduce(
      (newObj, curr) => functionalHelpers.callWithParams(fn, [newObj, obj[curr], curr, obj], 2),
      initialValue
    )

  /**
   * Helper function for testing if the item is an Object or Array that contains properties or elements
   * @function notEmptyObjectOrArray
   * @param {Object|Array} item - Object or Array to test
   * @returns {boolean}
   */
  functionalHelpers.notEmptyObjectOrArray = item => !!(
    (typeof item === 'object' && Object.keys(item).length) || (Array.isArray(item) && item.length)
  )

  /**
   * Re-add the Object Properties which cannot be cloned and must be directly copied to the new cloned object
   * WARNING: This is a recursive function.
   * @param {Object} cloned - A value-only copy of the original object
   * @param {Object} object - The original object that is being cloned
   * @returns {Object|Array}
   */
  const cloneCopy = (object, cloned) =>
    functionalHelpers.notEmptyObjectOrArray(object)
      ? functionalHelpers.reduceObject(object, (start, prop, key) => {
        start[key] = (cloned[key] && !/^(parentItem|listenerArgs|element)$/.test(key))
          ? cloneCopy(prop, cloned[key])
          : prop
        return start
      }, cloned)
      : cloned

  /**
   * Clone objects for manipulation without data corruption, returns a copy of the provided object.
   * @function cloneObject
   * @param {Object} object - The original object that is being cloned
   * @returns {Object}
   */
  functionalHelpers.cloneObject = object => cloneCopy(object, JSON.parse(
    JSON.stringify(object, (key, val) => !/^(parentItem|listenerArgs|element)$/.test(key)
      ? val
      : undefined)
  ))

  /**
   * Merge two objects and provide clone or original on the provided function.
   * The passed function should accept a minimum of two objects to be merged.
   * If the desire is to mutate the input objects, then the function name should
   * have the word 'mutable' in the name (case-insensitive).
   * @param {module:core/core.mergeObjects|module:core/core.mergeObjectsMutable|Function} fn - Pass one of
   * the mergeObjects functions to be used
   * @param {Object} obj1 - The receiving object; this is the object which will have it's properties overridden
   * @param {Object} obj2 - The contributing object; this is the object which will contribute new properties and
   * override existing ones
   * @param {boolean} [isMutable=false] - An optional flag which indicates whether we will clone objects or directly
   * modify them
   * @returns {Object}
   */
  const mergeObjectsBase = (fn, obj1, obj2, isMutable = false) => functionalHelpers.notEmptyObjectOrArray(obj2)
    ? functionalHelpers.mapObject(
      obj2,
      (prop, key) => (obj1[key] && !/^(parentItem|listenerArgs|element)$/.test(key))
        ? fn(obj1[key], prop)
        : prop,
      isMutable ? obj1 : functionalHelpers.cloneObject(obj1)
    )
    : obj2

  /**
   * Perform a deep merge of objects. This will combine all objects and sub-objects,
   * objects having the same attributes will overwrite starting from the end of the argument
   * list and bubbling up to return a merged version of the first object.
   * WARNING: This is a recursive function.
   * @function mergeObjects
   * @param {...Object} args - Provide a list of objects which will be merged starting from the end up into the first
   * object
   * @returns {Object}
   */
  functionalHelpers.mergeObjects = (...args) => args.length === 2
    ? mergeObjectsBase(functionalHelpers.mergeObjects, args[0], args[1])
    : args.length === 1
      ? functionalHelpers.cloneObject(args[0])
      : args.reduce(functionalHelpers.curry(mergeObjectsBase)(functionalHelpers.mergeObjects), {})

  /**
   * Perform a deep merge of objects. This will combine all objects and sub-objects,
   * objects having the same attributes will overwrite starting from the end of the argument
   * list and bubbling up to return the overwritten first object.
   * WARNING: This is a recursive function.
   * WARNING: This will mutate the first object passed in as input
   * @function mergeObjectsMutable
   * @param {...Object} args - Provide a list of objects which will be merged starting from the end up into the first
   * object
   * @returns {Object}
   */
  functionalHelpers.mergeObjectsMutable = (...args) => args.length === 2
    ? mergeObjectsBase(functionalHelpers.mergeObjectsMutable, args[0], args[1], true)
    : args.length === 1
      ? args[0]
      : args.reduce(functionalHelpers.curry(mergeObjectsBase)(functionalHelpers.mergeObjectsMutable), {})

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
  const buildArrayBase = (useReference, item, length, arr = []) => --length > 0
    ? buildArrayBase(useReference, (useReference ? item : functionalHelpers.cloneObject(item)), length, arr.concat([item]))
    : arr.concat([item])

  /**
   * Leverage buildArrayBase to generate an array filled with a copy of the provided item.
   * The length defines how long the array should be.
   * @function buildArray
   * @param {*} item - The item to be used for each array element
   * @param {number} length - The desired length of the array
   * @param {Array} [arr=[]] - The in-progress array of elements to be built and returned, will be used internally
   * @returns {Array.<*>}
   */
  functionalHelpers.buildArray = functionalHelpers.curry(buildArrayBase)(false)

  /**
   * Leverage buildArrayBase to generate an array filled with references to the provided item.
   * The length defines how long the array should be.
   * @function buildArrayOfReferences
   * @param {*} item - The item to be used for each array element
   * @param {number} length - The desired length of the array
   * @param {Array} [arr=[]] - The in-progress array of elements to be built and returned, will be used internally
   * @returns {Array.<*>}
   */
  functionalHelpers.buildArrayOfReferences = functionalHelpers.curry(buildArrayBase)(true)

  /**
   * A simple function to check if an item is in an array
   * @function inArray
   * @param {Array} arr - Haystack which may contain the specified property
   * @param {*} prop - Needle to be found within the haystack
   * @returns {boolean}
   */
  functionalHelpers.inArray = (arr, prop) => arr.indexOf(prop) >= 0

  /**
   * Helper for returning the absolute max value
   * @function getAbsoluteMax
   * @param {number} num1 - A number to compare
   * @param {number} num2 - Another number to be compared against
   * @returns {number}
   */
  functionalHelpers.getAbsoluteMax = (num1, num2) => Math.abs(num1) > Math.abs(num2) ? num1 : num2

  /**
   * Helper for returning the absolute min value
   * @function getAbsoluteMin
   * @param {number} num1 - A number to compare
   * @param {number} num2 - Another number to be compared against
   * @returns {number}
   */
  functionalHelpers.getAbsoluteMin = (num1, num2) => Math.abs(num1) < Math.abs(num2) ? num1 : num2

  /**
   * Create a single random number within provided range. And with optional offset,
   * The distance between the result numbers can be adjusted with interval.
   * @function randomNumber
   * @param {number} range - Choose the breadth of the random number (0-100 would be 100 for range)
   * @param {number} [offset=0] - Choose the starting number (1-10 would be 1 for offset, 9 for range)
   * @param {number} [interval=1] - Choose the distance between numbers (~5, ~10, ~15 would be 5 for interval, 1 for
   * offset, 2 for range)
   * @returns {number}
   */
  functionalHelpers.randomNumber = (range, offset = 0, interval = 1) => (Math.random() * range + offset) * interval

  /**
   * Create a single random integer within provide range. And with optional offset,
   * The distance between the result numbers can be adjusted with interval.
   * @function randomInteger
   * @param {number} range - Choose the breadth of the random number (0-100 would be 100 for range)
   * @param {number} [offset=0] - Choose the starting number (1-10 would be 1 for offset, 9 for range)
   * @param {number} [interval=1] - Choose the distance between numbers (5, 10, 15 would be 5 for interval, 1 for
   * offset, 2 for range)
   * @returns {number}
   */
  functionalHelpers.randomInteger = (range, offset = 0, interval = 1) => (Math.floor(Math.random() * range) + offset) * interval

  /**
   * Compare two numbers and return:
   * -1 to indicate val1 is less than val2
   * 0 to indicate both values are the equal
   * 1 to indicate val1 is greater than val2
   * @function compare
   * @param {number} val1 - The first number to compare
   * @param {number} val2 - The second number to compare
   * @returns {number}
   */
  functionalHelpers.compare = (val1, val2) => val1 === val2 ? 0 : val1 > val2 ? 1 : -1

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
   * functionalHelpers.compareArrays(
   *   ['match1', 'firstMismatch1', 'match2', 'firstMismatch2', 'badMatch1'],
   *   ['match1', 'match2', 'secondMismatch1', 'badMatch1', 'badMatch1']
   * )
   * // unique array
   * ['secondMismatch1', 'match1', 'firstMismatch1', 'match2', 'firstMismatch2', 'badMatch1']
   * // result object
   * {secondMismatch1: -1, match1: 0, firstMismatch1: 1, match2: 0, firstMismatch2: 1, badMatch1: -1}
   * @function compareArrays
   * @param {Array} arr1 - The first array to compare
   * @param {Array} arr2 - The second array to compare
   * @returns {Object.<string, number>}
   */
  functionalHelpers.compareArrays = (arr1, arr2) =>
    arr2.filter(attr => !functionalHelpers.inArray(arr1, attr))
      .concat(arr1)
      .reduce(
        (returnObj, attr) => functionalHelpers.setValue(
          (typeof attr === 'string')
            ? attr
            : JSON.stringify(attr, (key, val) => !/^(parentItem|listenerArgs|element)$/.test(key) ? val : undefined),
          functionalHelpers.compare(arr1.filter(val => val === attr).length, arr2.filter(val => val === attr).length),
          returnObj
        ),
        {}
      )

  /**
   * This was adapted from a blog post on Composing Software written by Eric Elliott. Trace provides a way to traces
   * steps through code via the console, while maintaining the functional-style return value.
   * Returns a function which can then receive a value to output, the value will then be returned.
   * @author Eric Elliott
   * @function trace
   * @param {string} label - Pass an identifying label of the value being output.
   * @returns {function(*=)}
   */
  functionalHelpers.trace = label => value => {
    console.info(`${label}: `, value)
    return value
  }

  /**
   * Run Timeout functions one after the other in queue. This function needs some work to comply with the standards
   * applied to the rest of this file where this is not a Pure function, and it does not reliably return a result. This
   * implementation should likely be used with Promise instead.
   * WARNING: This is a recursive function.
   * @function queueTimeout
   * @param {function|object|boolean} fn - A callback function to be performed at some time in the future.
   * @param {number} time - The time in milliseconds to delay.
   * @param {...*} args - Arguments to be passed to the callback once it is implemented.
   * @returns {{id: number, func: function, timeout: number, args: {Array}, result: *}}
   */
  functionalHelpers.queueTimeout = (fn = {}, time = 0, ...args) => {
    // Track the queue to be processed in FIFO
    functionalHelpers.queueTimeout.queue = functionalHelpers.queueTimeout.queue || []
    // Do not run more than one queued item at a time
    functionalHelpers.queueTimeout.isRunning = functionalHelpers.queueTimeout.isRunning || false
    // Construct an object which will store the queued function data
    const queueItem = { id: 0, func: fn, timeout: time, args: args, result: 0 }
    if (fn) {
      // When the function is valid, append it to the end of the queue
      functionalHelpers.queueTimeout.queue.push(queueItem)
    }
    if (functionalHelpers.queueTimeout.queue.length && !functionalHelpers.queueTimeout.isRunning) {
      // Check that the queue is not empty, and it is not running a queued item
      // Set isRunning flag to begin processing the next queued item
      functionalHelpers.queueTimeout.isRunning = true
      // Pick an item off the front of the queue, and thereby reduce the queue size
      const toRun = functionalHelpers.queueTimeout.queue.shift()
      // Get the timeout ID when it has begun
      toRun.id = setTimeout(() => {
        // Run the function after the provided timeout
        toRun.result = toRun.func(...toRun.args)
        // Reset isRunning flag
        functionalHelpers.queueTimeout.isRunning = false
        // Re-run the queue which will get the next queued item if there is one
        return functionalHelpers.queueTimeout(false)
      }, toRun.timeout)
      // Return whatever object we have for the current queued item being processed, likely incomplete because the
      // function will complete in the future
      return toRun
    }
    // Return newly created queuedItem
    return queueItem
  }

  /**
   * Either export all functions to be exported, or assign to the Window context
   */
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = functionalHelpers
    }
    exports = Object.assign(exports, functionalHelpers)
  }
}).call(this || window || {})
// Use the external context to assign this, which will be Window if rendered via browser

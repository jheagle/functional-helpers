'use strict'

require('core-js/modules/es.symbol')

require('core-js/modules/es.symbol.description')

require('core-js/modules/es.symbol.iterator')

require('core-js/modules/es.array.concat')

require('core-js/modules/es.array.filter')

require('core-js/modules/es.array.find-index')

require('core-js/modules/es.array.from')

require('core-js/modules/es.array.includes')

require('core-js/modules/es.array.iterator')

require('core-js/modules/es.array.map')

require('core-js/modules/es.array.reduce')

require('core-js/modules/es.array.slice')

require('core-js/modules/es.array.some')

require('core-js/modules/es.array.splice')

require('core-js/modules/es.function.name')

require('core-js/modules/es.object.to-string')

require('core-js/modules/es.regexp.to-string')

require('core-js/modules/es.string.includes')

require('core-js/modules/es.string.iterator')

require('core-js/modules/web.dom-collections.iterator')

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.processMergeIdentifiers = exports.processMergeIdentifer = exports.mergeReferences = exports.mergeReferenceObject = exports.mergeReferenceArrays = exports.mergeNonReferences = void 0

var _arrays = require('../arrays')

var _functions = require('../functions')

var _objects = require('../objects')

var _cloneHelpers = require('./cloneHelpers')

function _toConsumableArray (arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread() }

function _nonIterableSpread () { throw new TypeError('Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.') }

function _unsupportedIterableToArray (o, minLen) { if (!o) return; if (typeof o === 'string') return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === 'Object' && o.constructor) n = o.constructor.name; if (n === 'Map' || n === 'Set') return Array.from(o); if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen) }

function _iterableToArray (iter) { if (typeof Symbol !== 'undefined' && Symbol.iterator in Object(iter)) return Array.from(iter) }

function _arrayWithoutHoles (arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr) }

function _arrayLikeToArray (arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i] } return arr2 }

/**
 * Check if there are still references having a merged status of false.
 * @param {*} referenceMap
 * @returns {boolean}
 */
var hasUnmergedReferences = function hasUnmergedReferences (referenceMap) {
  return referenceMap.some(function (newRef) {
    return newRef.merged === false
  })
}
/**
 * Take two reference identifiers and merge the non references together, identify overwritten references.
 * @param {module:cloneHelpers~referenceMap} firstMap
 * @param {number} firstIndex
 * @param {module:cloneHelpers~referenceMap} secondMap
 * @param {number} secondIndex
 * @param {Array.<module:cloneHelpers~referenceIdentifier>} remove
 * @returns {module:cloneHelpers~referenceMap}
 */

var mergeNonReferences = function mergeNonReferences (firstMap, firstIndex, secondMap, secondIndex) {
  var remove = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : []
  var firstRefIndex = (0, _cloneHelpers.findReferenceIndex)(firstMap, firstIndex)
  var secondRefIndex = (0, _cloneHelpers.findReferenceIndex)(secondMap, secondIndex)

  if (firstRefIndex < 0) {
    secondMap[secondRefIndex].complete = true
    secondMap[secondRefIndex].merged = true
    return (0, _objects.mapObject)(secondMap[secondRefIndex].object, function (value) {
      return value
    })
  }

  if (secondRefIndex < 0) {
    firstMap[firstRefIndex].complete = true
    firstMap[firstRefIndex].merged = true
    return firstMap[firstRefIndex].object
  }

  if (firstMap[firstRefIndex].merged && secondMap[secondRefIndex].merged) {
    return firstMap[firstRefIndex].object
  }

  firstMap[firstRefIndex].complete = true
  firstMap[firstRefIndex].merged = true
  secondMap[secondRefIndex].complete = true
  secondMap[secondRefIndex].merged = true

  if (Array.isArray(firstMap[firstRefIndex].object) && Array.isArray(secondMap[secondRefIndex].object)) {
    return (0, _arrays.mergeArrays)(firstMap[firstRefIndex].object, secondMap[secondRefIndex].object)
  }

  var keys = (0, _arrays.compareArrays)((0, _objects.objectKeys)(firstMap[firstRefIndex].object), (0, _objects.objectKeys)(secondMap[secondRefIndex].object))
  firstMap[firstRefIndex].object = keys.reduce(function (newObject, compareResult) {
    var refIndexFirst = firstMap[firstRefIndex].references.findIndex(function (refKey) {
      return refKey === compareResult.value
    })

    if (compareResult.result[0] === 1) {
      if (refIndexFirst >= 0) {
        var refUnchanged = (0, _cloneHelpers.findReferenceIndex)(firstMap, firstMap[firstRefIndex].object[compareResult.value])

        if (firstMap[refUnchanged].merged === false) {
          firstMap[refUnchanged].complete = true
          firstMap[refUnchanged].merged = true
        }
      }

      return (0, _objects.setValue)(compareResult.value, firstMap[firstRefIndex].object[compareResult.value], newObject)
    }

    var refIndexSecond = secondMap[secondRefIndex].references.findIndex(function (refKey) {
      return refKey === compareResult.value
    })
    var newValue = secondMap[secondRefIndex].object[compareResult.value]

    if (refIndexSecond >= 0 && refIndexFirst < 0) {
      var nextSecondRef = (0, _cloneHelpers.findReference)(secondMap, secondMap[secondRefIndex].object[compareResult.value])
      newValue = firstMap[firstMap.length - 1].index + 1
      var nextFirstRef = (0, _cloneHelpers.createReferenceIdentifier)(nextSecondRef.original, newValue, [firstIndex])
      nextFirstRef.complete = false
      nextFirstRef.merged = false
      nextFirstRef.object = Array.isArray(nextSecondRef.original) ? [] : {}
      firstMap.push(nextFirstRef)
      firstMap[firstRefIndex].references.push(compareResult.value)
      firstMap[firstRefIndex].object[compareResult.value] = newValue
    }

    if (compareResult.result[0] === -1) {
      return (0, _objects.setValue)(compareResult.value, newValue, newObject)
    }

    if (refIndexFirst < 0) {
      return refIndexSecond < 0 ? (0, _objects.setValue)(compareResult.value, secondMap[secondRefIndex].object[compareResult.value], newObject) : (0, _objects.setValue)(compareResult.value, firstMap[firstRefIndex].object[compareResult.value], newObject)
    }

    if (refIndexSecond >= 0) {
      return (0, _objects.setValue)(compareResult.value, firstMap[firstRefIndex].object[compareResult.value], newObject)
    }

    var removedRef = (0, _cloneHelpers.findReference)(firstMap, firstMap[firstRefIndex].object[compareResult.value])
    var refererIndex = removedRef.referers.findIndex(function (referer) {
      return referer === firstIndex
    })

    if (refererIndex >= 0) {
      removedRef.referers.splice(refererIndex, 1)
    }

    remove.push(removedRef)
    firstMap[firstRefIndex].references.splice(refIndexFirst, 1)
    return (0, _objects.setValue)(compareResult.value, secondMap[secondRefIndex].object[compareResult.value], newObject)
  }, {})
  return firstMap[firstRefIndex].object
}
/**
 * Remove duplicate references from and array of references
 * @param {Array.<string|number|Array>} newRefs
 * @param {string|number|Array} ref
 * @returns {Array.<string|number|Array>}
 */

exports.mergeNonReferences = mergeNonReferences

var mergeReferenceArrays = function mergeReferenceArrays (newRefs, ref) {
  if (!Array.isArray(ref)) {
    var _existingRefKey = newRefs.findIndex(function (r) {
      return Array.isArray(r) ? r[0] === ref : r === ref
    })

    if (_existingRefKey < 0) {
      newRefs.push(ref)
    }

    return newRefs
  }

  var existingRefKey = newRefs.findIndex(function (r) {
    return Array.isArray(r) ? r[0] === ref[0] : r === ref[0]
  })

  if (Array.isArray(ref[1])) {
    ref[1] = ref[1].reduce(mergeReferenceArrays, [])
  }

  if (existingRefKey < 0) {
    return [].concat(_toConsumableArray(newRefs), [ref])
  }

  if (!Array.isArray(newRefs[existingRefKey])) {
    return (0, _objects.setValue)(existingRefKey, ref, newRefs)
  }

  if (newRefs[existingRefKey].length === 1) {
    return (0, _objects.setValue)(existingRefKey, ref, newRefs)
  }

  var newPart = newRefs[existingRefKey][1]

  if (!Array.isArray(newPart)) {
    return (0, _objects.setValue)(existingRefKey, [ref[0], newPart], newRefs)
  }

  if (Array.isArray(ref[1])) {
    newPart = (0, _arrays.mergeArrays)(newPart, ref[1])
  }

  if (!Array.isArray(ref[1]) && Array.isArray(newPart)) {
    newPart.push(ref[1])
  }

  return (0, _objects.setValue)(existingRefKey, [ref[0], newPart.reduce(mergeReferenceArrays, [])], newRefs)
}
/**
 * Used as callback for reduce-like for-loop, this function will find each reference identifier
 * in object1 and merge object2 similar reference onto object1. object1 will then be returned.
 * @typedef {Function} mergeReferencesReduce
 * @param {module:cloneHelpers~objectReferencesRemove} object1
 * @param {number|string} key
 * @param {number} i
 * @returns {module:cloneHelpers~objectReferencesRemove}
 */

/**
 * Return the mergeReferencesReduce callback.
 * @function
 * @param {module:cloneHelpers~referenceMap} firstMap
 * @param {module:cloneHelpers~referenceMap} secondMap
 * @param {module:cloneHelpers~objectReferencesRemove} object2
 * @returns {module:mergeHelpers~mergeReferencesReduce}
 */

exports.mergeReferenceArrays = mergeReferenceArrays

var mergeReferenceObject = function mergeReferenceObject (firstMap, secondMap, object2) {
  return function (object1, key, i) {
    var isCircular = false
    var keyArray = key

    if (Array.isArray(key)) {
      keyArray = Array.isArray(key[0]) ? key[0] : key

      if (keyArray[1] === null) {
        key = keyArray[0]
        isCircular = true
      }
    }

    if (Array.isArray(key)) {
      var nextFirstObject = object1.object[keyArray[0]]
      var nextSecondObject = object2.object[keyArray[0]]

      if (typeof nextFirstObject === 'number') {
        object1.index = nextFirstObject
        nextFirstObject = (0, _cloneHelpers.findReference)(firstMap, nextFirstObject).object
      }

      if (typeof nextSecondObject === 'number') {
        object2.index = nextSecondObject
        nextSecondObject = (0, _cloneHelpers.findReference)(secondMap, nextSecondObject).object
      }

      var references = keyArray[1].map(function (ref) {
        return ref
      })
      var firstRefs = keyArray[1]
      var secondRefs = keyArray[1].map(function (ref) {
        return ref
      })
      var newObj1 = (0, _cloneHelpers.objectAndReferences)(nextFirstObject, firstRefs, object1.index)
      var newObj2 = (0, _cloneHelpers.objectAndReferences)(nextSecondObject, secondRefs, object2.index)

      var _loop = function _loop (j) {
        var nextKey = references[j]
        var position = keyArray[1].findIndex(function (ref) {
          return ref === nextKey
        })
        mergeReferenceObject(firstMap, secondMap, newObj2)(newObj1, nextKey, position)
        key[1] = newObj1.references
      }

      for (var j in references) {
        _loop(j)
      }

      object1.remove = [].concat(_toConsumableArray(object1.remove), _toConsumableArray(newObj1.remove))
      return object1
    }

    var nextFirstIndex = object1.object[key]
    var nextSecondIndex = object2.object[key]

    if (typeof nextSecondIndex !== 'number') {
      if (typeof nextFirstIndex === 'number') {
        var nextFirstRefIndex = (0, _cloneHelpers.findReferenceIndex)(firstMap, nextFirstIndex)
        firstMap[nextFirstRefIndex].complete = true
        firstMap[nextFirstRefIndex].merged = true
      }

      return object1
    }

    var nextSecondRef = (0, _cloneHelpers.findReference)(secondMap, nextSecondIndex)

    if (typeof nextSecondRef.merged === 'undefined') {
      return object1
    }

    var nextFirstRef = (0, _cloneHelpers.findReference)(firstMap, nextFirstIndex)
    nextSecondRef.complete = true
    nextSecondRef.merged = true

    if (typeof nextFirstRef.merged === 'undefined') {
      return object1
    }

    object1.object[key] = mergeNonReferences(firstMap, nextFirstRef.index, secondMap, nextSecondRef.index, object1.remove)
    var removeFirstReferer = nextFirstRef.referers.findIndex(function (i) {
      return i === object1.index
    })
    nextFirstRef.referers.splice(removeFirstReferer, 1)
    var nextFirstReferences = nextFirstRef.references.map(function (ref) {
      return nextFirstRef.circular.includes(ref) ? [ref, null] : ref
    })
    object1.remove.push(nextFirstRef)
    var firstTrueIndex = (0, _cloneHelpers.findReferenceIndex)(firstMap, nextFirstIndex)
    firstMap[firstTrueIndex] = nextFirstRef

    if (nextFirstReferences.length && !isCircular) {
      object1.references[i] = [key, nextFirstReferences]
      object1.references = object1.references.reduce(mergeReferenceArrays, [])
      return object1
    }

    object1.references.splice(i, 1)
    return object1
  }
}
/**
 * Find each of the unlinked references and assign the newly cloned reference for each.
 * @function
 * @param {module:cloneHelpers~referenceMap} firstMap
 * @param {module:cloneHelpers~referenceMap} secondMap
 * @returns {module:cloneHelpers~referenceMap}
 */

exports.mergeReferenceObject = mergeReferenceObject

var mergeReferences = function mergeReferences (firstMap, secondMap) {
  if (typeof firstMap[0].merged === 'undefined' || typeof secondMap[0].merged === 'undefined') {
    return firstMap
  }

  var remove = []
  firstMap[0].object = mergeNonReferences(firstMap, 0, secondMap, 0, remove)
  var objRefs = (0, _arrays.mergeArrays)(firstMap[0].references, secondMap[0].references)
  objRefs = objRefs.reduce(mergeReferenceArrays, [])
  var object1 = (0, _cloneHelpers.objectAndReferences)(firstMap[0].object, objRefs, 0)
  var object2 = (0, _cloneHelpers.objectAndReferences)(secondMap[0].object, secondMap[0].references, 0)
  var references = objRefs.map(function (ref) {
    return ref
  })

  var _loop2 = function _loop2 (i) {
    var key = references[i]
    var position = firstMap[0].references.findIndex(function (ref) {
      return ref === key
    })
    mergeReferenceObject(firstMap, secondMap, object2)(object1, key, position)
    firstMap[0].references = object1.references
  }

  for (var i in references) {
    _loop2(i)
  }

  remove = [].concat(_toConsumableArray(remove), _toConsumableArray(object1.remove))
  var removeFunc = (0, _cloneHelpers.removeFromReferenceMap)(firstMap)
  var removeStatus = remove.reduce(function (status, ref) {
    var result = removeFunc(ref)
    return status ? result : status
  }, true)

  if (removeStatus) {
    firstMap = (0, _cloneHelpers.linkReferences)(firstMap)
  }

  if (removeStatus) {
    if (firstMap.length === 1) {
      secondMap.map(function (ref) {
        ref.complete = true
        ref.merged = true
        return ref
      })
    }

    secondMap = (0, _cloneHelpers.linkReferences)(secondMap)
  }

  return hasUnmergedReferences(firstMap) && hasUnmergedReferences(secondMap) ? mergeReferences(firstMap, secondMap) : firstMap
}
/**
 * Bundle all of the functions needed for processing an identifier in the reference map
 * @function
 * @param {module:cloneHelpers~referenceMap} referenceMap
 * @param {Array.<module:cloneHelpers~referenceIdentifier>} moreReferences
 * @param {Object} [options={}]
 * @param {number} [options.mapLimit=100]
 * @param {depthLimit} [options.depthLimit=-1]
 * @returns {Array.<module:cloneHelpers~referenceIdentifier>}
 */

exports.mergeReferences = mergeReferences

var processMergeIdentifer = function processMergeIdentifer (referenceMap, moreReferences) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {}
  var _ref$mapLimit = _ref.mapLimit
  var mapLimit = _ref$mapLimit === void 0 ? 100 : _ref$mapLimit
  var _ref$depthLimit = _ref.depthLimit
  var depthLimit = _ref$depthLimit === void 0 ? -1 : _ref$depthLimit

  var currentIndex = 0
  referenceMap = (0, _functions.pipe)(function (identifier) {
    return (0, _cloneHelpers.findReferenceIndex)(referenceMap, identifier.index)
  }, function (index) {
    currentIndex = index
    return (0, _cloneHelpers.findObjectReferences)(referenceMap[currentIndex])
  }, function (identifier) {
    return (0, _cloneHelpers.findReferenceKeys)(referenceMap, currentIndex)
  }, function (identifier) {
    referenceMap[currentIndex].merged = false
    var references = referenceMap[currentIndex].references.filter(function (refKey) {
      return !identifier.circular.includes(refKey)
    })
    moreReferences = [].concat(_toConsumableArray(moreReferences), _toConsumableArray(references.map(function (key) {
      return referenceMap[identifier.object[key]]
    })))
    return referenceMap.length >= mapLimit
  })(moreReferences.shift())
  return moreReferences
}
/**
 * Loop over every identifier and process, then return the reference map.
 * @param {Array|Object} object
 * @param {Object} [options={}]
 * @param {number} [options.mapLimit=100]
 * @param {depthLimit} [options.depthLimit=-1]
 * @returns {module:cloneHelpers~referenceMap}
 */

exports.processMergeIdentifer = processMergeIdentifer

var processMergeIdentifiers = function processMergeIdentifiers (object) {
  var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}
  var _ref2$mapLimit = _ref2.mapLimit
  var mapLimit = _ref2$mapLimit === void 0 ? 100 : _ref2$mapLimit
  var _ref2$depthLimit = _ref2.depthLimit
  var depthLimit = _ref2$depthLimit === void 0 ? -1 : _ref2$depthLimit

  var referenceMap = [(0, _cloneHelpers.createReferenceIdentifier)(object, 0)]
  var moreReferences = [referenceMap[0]]

  do {
    moreReferences = processMergeIdentifer(referenceMap, moreReferences, {
      mapLimit: mapLimit,
      depthLimit: depthLimit
    })
  } while (moreReferences.length > 0)

  return referenceMap
}

exports.processMergeIdentifiers = processMergeIdentifiers
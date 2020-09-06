'use strict'

require('core-js/modules/es.symbol')

require('core-js/modules/es.symbol.description')

require('core-js/modules/es.symbol.iterator')

require('core-js/modules/es.array.concat')

require('core-js/modules/es.array.every')

require('core-js/modules/es.array.filter')

require('core-js/modules/es.array.find')

require('core-js/modules/es.array.find-index')

require('core-js/modules/es.array.for-each')

require('core-js/modules/es.array.from')

require('core-js/modules/es.array.includes')

require('core-js/modules/es.array.iterator')

require('core-js/modules/es.array.map')

require('core-js/modules/es.array.reduce')

require('core-js/modules/es.array.slice')

require('core-js/modules/es.array.some')

require('core-js/modules/es.function.name')

require('core-js/modules/es.object.assign')

require('core-js/modules/es.object.keys')

require('core-js/modules/es.object.to-string')

require('core-js/modules/es.regexp.to-string')

require('core-js/modules/es.string.includes')

require('core-js/modules/es.string.iterator')

require('core-js/modules/web.dom-collections.for-each')

require('core-js/modules/web.dom-collections.iterator')

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.mergeObjectsMutable = exports.mergeObjects = exports.cloneObject = exports.assignNewReferences = exports.mapOriginalObject = exports.describeObjectMap = exports.sameDescriptor = exports.compareDescriptor = exports.describeObject = exports.assignDescriptor = exports.describeObjectDetail = exports.notEmptyObjectOrArray = exports.reduceObject = exports.filterObject = exports.mapProperty = exports.mapObject = exports.setAndReturnValue = exports.setValue = void 0

require('core-js/stable')

var _functions = require('./functions')

var _arrays = require('./arrays')

function _toConsumableArray (arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread() }

function _nonIterableSpread () { throw new TypeError('Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.') }

function _unsupportedIterableToArray (o, minLen) { if (!o) return; if (typeof o === 'string') return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === 'Object' && o.constructor) n = o.constructor.name; if (n === 'Map' || n === 'Set') return Array.from(o); if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen) }

function _iterableToArray (iter) { if (typeof Symbol !== 'undefined' && Symbol.iterator in Object(iter)) return Array.from(iter) }

function _arrayWithoutHoles (arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr) }

function _arrayLikeToArray (arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i] } return arr2 }

function _typeof (obj) { '@babel/helpers - typeof'; if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') { _typeof = function _typeof (obj) { return typeof obj } } else { _typeof = function _typeof (obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj } } return _typeof(obj) }

/**
 * Set a value on an item, then return the item
 * @function
 * @param {string|number} key - The key on the item which will have its value set
 * @param {*} value - Any value to be applied to the key
 * @param {Object|Array} item - An object or array to be updated
 * @returns {Object|Array}
 */
var setValue = function setValue (key, value, item) {
  item[key] = value
  return item
}
/**
 * Set a value on an item, then return the value
 * @function
 * @param {Object|Array} item - An object or array to be updated
 * @param {string|number} key - The key on the item which will have its value set
 * @param {*} value - Any value to be applied to the key
 * @returns {*}
 */

exports.setValue = setValue

var setAndReturnValue = function setAndReturnValue (item, key, value) {
  item[key] = value
  return value
}
/**
 * Function that produces a property of the new Object, taking three arguments
 * @callback mapCallback
 * @param {*} currentProperty - The current property being processed in the object.
 * @param {string} [currentIndex] - The property name of the current property being processed in the object.
 * @param {Object|Array} [object] - The object map was called upon.
 * @returns {*}
 */

/**
 * This function is intended to replicate behaviour of the Array.map() function but for Objects.
 * If an array is passed in instead then it will perform standard map(). It is recommended to
 * always use the standard map() function when it is known that the object is actually an array.
 * @function
 * @param {Object|Array} obj - The Object (or Array) to be mapped
 * @param {module:objectHelpers~mapCallback|Function} fn - The function to be processed for each mapped property
 * @param {Object|Array} [thisArg] - Optional. Value to use as this when executing callback.
 * @returns {Object|Array}
 */

exports.setAndReturnValue = setAndReturnValue

var mapObject = function mapObject (obj, fn) {
  var thisArg = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined
  return Array.isArray(obj) ? obj.map(fn, thisArg) : Object.keys(obj).reduce(function (newObj, curr) {
    return setValue(curr, (0, _functions.callWithParams)(fn, [obj[curr], curr, obj], 2), newObj)
  }, thisArg || {})
}
/**
 * Perform map on an array property of an object, then return the object
 * @function
 * @param {string} property - The string key for the array property to be mapped
 * @param {module:objectHelpers~mapCallback|Function} mapFunction - A function suitable to be passed to map
 * @param {Object|Array} obj - An object having an array property
 * @returns {object}
 */

exports.mapObject = mapObject

var mapProperty = function mapProperty (property, mapFunction, obj) {
  obj[property] = mapObject(obj[property] || [], mapFunction)
  return obj
}
/**
 * Function is a predicate, to test each property value of the object. Return true to keep the element, false
 * otherwise, taking three arguments
 * @callback filterCallback
 * @param {*} currentProperty - The current property being processed in the object.
 * @param {string} [currentIndex] - The property name of the current property being processed in the object.
 * @param {Object|Array} [object] - The object filter was called upon.
 * @returns {boolean}
 */

/**
 * This function is intended to replicate behaviour of the Array.filter() function but for Objects.
 * If an array is passed in instead then it will perform standard filter(). It is recommended to
 * always use the standard filter() function when it is known that the object is actually an array.
 * @function
 * @param {Object|Array} obj - The Object (or Array) to be filtered
 * @param {module:objectHelpers~filterCallback|Function} fn - The function to be processed for each filtered property
 * @param {Object|Array} [thisArg] - Optional. Value to use as this when executing callback.
 * @returns {Object|Array}
 */

exports.mapProperty = mapProperty

var filterObject = function filterObject (obj, fn) {
  var thisArg = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined
  return Array.isArray(obj) ? obj.filter(fn, thisArg) : Object.keys(obj).reduce(function (newObj, curr) {
    if ((0, _functions.callWithParams)(fn, [obj[curr], curr, obj], 2)) {
      newObj[curr] = obj[curr]
    } else {
      delete newObj[curr]
    }

    return newObj
  }, thisArg || {})
}
/**
 * Function to execute on each property in the object, taking four arguments
 * @callback reduceCallback
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
 * @function
 * @param {Object|Array} obj - The Object (or Array) to be filtered
 * @param {module:objectHelpers~reduceCallback|Function} fn - The function to be processed for each filtered property
 * @param {Object|Array} [initialValue] - Optional. Value to use as the first argument to the first call of the
 * callback. If no initial value is supplied, the first element in the array will be used. Calling reduce on an empty
 * array without an initial value is an error.
 * @returns {Object|Array}
 */

exports.filterObject = filterObject

var reduceObject = function reduceObject (obj, fn) {
  var initialValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : obj[Object.keys(obj)[0]] || obj[0]
  return Array.isArray(obj) ? obj.reduce(fn, initialValue) : Object.keys(obj).reduce(function (newObj, curr) {
    return (0, _functions.callWithParams)(fn, [newObj, obj[curr], curr, obj], 2)
  }, initialValue)
}
/**
 * Helper function for testing if the item is an Object or Array that contains properties or elements
 * @function
 * @param {Object|Array} item - Object or Array to test
 * @returns {boolean}
 */

exports.reduceObject = reduceObject

var notEmptyObjectOrArray = function notEmptyObjectOrArray (item) {
  return !!(_typeof(item) === 'object' && Object.keys(item).length || Array.isArray(item) && item.length)
}
/**
 * Trace an object's attribute and provide details about it.
 * @function
 * @param {*} value
 * @param {string|number} [key=0]
 * @param {number} [index=0]
 * @returns {module:descriptorSamples~descriptorDetail}
 */

exports.notEmptyObjectOrArray = notEmptyObjectOrArray

var describeObjectDetail = function describeObjectDetail (value) {
  var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0
  var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0

  var type = _typeof(value)

  var isReference = type === 'object' && value !== null
  return {
    index: index,
    key: key,
    type: [type],
    value: [value],
    nullable: value === null,
    optional: false,
    circular: false,
    isReference: isReference,
    arrayReference: null,
    objectReference: null
  }
}
/**
 * Build an array of all keys from the details of this descriptor.
 * @function
 * @param {module:descriptorSamples~descriptor} descriptor
 * @returns {Array.<string>}
 */

exports.describeObjectDetail = describeObjectDetail

var descriptorKeys = function descriptorKeys (descriptor) {
  return (0, _arrays.uniqueArray)(descriptor.details.map(function (detail) {
    return detail.key
  }))
}
/**
 * Create an array of the indexes in the details that contain references.
 * @function
 * @param {module:descriptorSamples~descriptor} descriptor
 * @returns {Array.<number>}
 */

var descriptorReferences = function descriptorReferences (descriptor) {
  return (0, _arrays.uniqueArray)(descriptor.details.filter(function (detail) {
    return detail.isReference
  }).map(function (detail) {
    return detail.index
  }))
}
/**
 * Check based on the detail keys if this descriptor represents an array.
 * @function
 * @param {module:descriptorSamples~descriptor} descriptor
 * @returns {boolean}
 */

var descriptorIsArray = function descriptorIsArray (descriptor) {
  return descriptor.details.every(function (detail) {
    return typeof detail.key === 'number'
  })
}
/**
 * Make a copy of an object descriptor so that the original will not be mutated.
 * @function
 * @param {module:descriptorSamples~descriptor} originalMap
 * @returns {module:descriptorSamples~descriptor}
 */

var cloneDescriptor = function cloneDescriptor (originalMap) {
  var copyMap = {}
  copyMap.index = originalMap.index || 0
  copyMap.details = originalMap.details.map(function (detail) {
    var copyDetail = {}
    Object.keys(detail).forEach(function (key) {
      copyDetail[key] = Array.isArray(detail[key]) ? detail[key].map(function (value) {
        return value
      }) : detail[key]
    })
    return copyDetail
  })
  copyMap.length = originalMap.length
  copyMap.keys = originalMap.keys.map(function (key) {
    return key
  })
  copyMap.references = originalMap.references.map(function (reference) {
    return reference
  })
  copyMap.isArray = originalMap.isArray
  copyMap.complete = originalMap.complete
  return copyMap
}
/**
 * Apply one or more descriptors to an existing descriptor so that they represent a merged version of the descriptors.
 * @function
 * @param {module:descriptorSamples~descriptor} originalMap
 * @param  {...module:descriptorSamples~descriptor} descriptors
 * @returns {module:descriptorSamples~descriptor}
 */

var assignDescriptor = function assignDescriptor (originalMap) {
  for (var _len = arguments.length, descriptors = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    descriptors[_key - 1] = arguments[_key]
  }

  return descriptors.reduce(function (assignedDescriptor, descriptor) {
    var detailsDiff = (0, _arrays.compareArrays)(assignedDescriptor.keys, descriptor.keys)
    detailsDiff.forEach(function (diff) {
      var existingDetail = assignedDescriptor.details.find(function (detail) {
        return detail.key === diff.value
      })
      var newDetail = descriptor.details.find(function (detail) {
        return detail.key === diff.value
      })

      if (diff.result.every(function (result) {
        return result === 0
      })) {
        assignedDescriptor.details[existingDetail.index] = Object.assign({}, existingDetail, {
          type: (0, _arrays.uniqueArray)([].concat(_toConsumableArray(existingDetail.type), _toConsumableArray(newDetail.type))),
          value: (0, _arrays.uniqueArray)([].concat(_toConsumableArray(existingDetail.value), _toConsumableArray(newDetail.value))),
          nullable: existingDetail.nullable || newDetail.nullable,
          isReference: existingDetail.isReference || newDetail.isReference,
          arrayReference: [existingDetail.arrayReference, newDetail.arrayReference].find(function (ref) {
            return typeof ref === 'number'
          }),
          objectReference: [existingDetail.objectReference, newDetail.objectReference].find(function (ref) {
            return typeof ref === 'number'
          })
        })
        assignedDescriptor.details[existingDetail.index].arrayReference = typeof assignedDescriptor.details[existingDetail.index].arrayReference === 'undefined' ? null : assignedDescriptor.details[existingDetail.index].arrayReference
        assignedDescriptor.details[existingDetail.index].objectReference = typeof assignedDescriptor.details[existingDetail.index].objectReference === 'undefined' ? null : assignedDescriptor.details[existingDetail.index].objectReference
        return assignedDescriptor
      }

      var useDetail = diff[0] > 0 ? existingDetail : newDetail

      if (!useDetail) {
        assignedDescriptor.details[existingDetail.index].optional = true
        return assignedDescriptor
      }

      var useIndex = diff[0] > 0 ? useDetail.index : assignedDescriptor.length
      assignedDescriptor.details[useIndex] = Object.assign({}, useDetail, {
        index: useIndex,
        optional: true
      })
      assignedDescriptor.length = assignedDescriptor.length < assignedDescriptor.details.length ? assignedDescriptor.details.length : assignedDescriptor.length
      return assignedDescriptor
    })
    assignedDescriptor.keys = descriptorKeys(assignedDescriptor)
    assignedDescriptor.references = descriptorReferences(assignedDescriptor)
    assignedDescriptor.isArray = descriptorIsArray(assignedDescriptor)
    assignedDescriptor.complete = !assignedDescriptor.references.length || assignedDescriptor.complete || descriptor.complete
    return assignedDescriptor
  }, cloneDescriptor(originalMap))
}
/**
 * Trace an object and return the descriptor which defines the object's structure and attributes.
 * @function
 * @param {Object} object
 * @returns {module:descriptorSamples~descriptor}
 */

exports.assignDescriptor = assignDescriptor

var describeObject = function describeObject (object) {
  var descriptor = reduceObject(object, function (descriptor, value, key) {
    if (typeof key === 'number' && descriptor.details.length) {
      var type = _typeof(value)

      var isReference = type === 'object' && value !== null

      if (value !== null) {
        descriptor.details[0].type = (0, _arrays.uniqueArray)([].concat(_toConsumableArray(descriptor.details[0].type), [type]))
      }

      descriptor.details[0].value = (0, _arrays.uniqueArray)([].concat(_toConsumableArray(descriptor.details[0].value), [value]))
      descriptor.details[0].nullable = descriptor.details[0].nullable || value === null
      descriptor.details[0].isReference = descriptor.details[0].isReference || isReference
      ++descriptor.length
      return descriptor
    }

    descriptor.details = [].concat(_toConsumableArray(descriptor.details), [describeObjectDetail(value, key, descriptor.length++)])
    return descriptor
  }, {
    index: 0,
    details: [],
    length: 0,
    keys: [],
    references: [],
    isArray: false,
    complete: false
  })
  descriptor.keys = descriptorKeys(descriptor)
  descriptor.references = descriptorReferences(descriptor)
  descriptor.isArray = Array.isArray(object) && descriptorIsArray(descriptor)
  descriptor.complete = !descriptor.references.length
  return descriptor
}
/**
 * Check if two descriptors are the same or similar in that they have similar keys and the associated types are the same.
 * @function
 * @param {module:descriptorSamples~descriptor} descriptor1
 * @param {module:descriptorSamples~descriptor} descriptor2
 * @returns {boolean}
 */

exports.describeObject = describeObject

var compareDescriptor = function compareDescriptor (descriptor1, descriptor2) {
  if (descriptor1.isArray !== descriptor2.isArray) {
    return false
  }

  if (descriptor1.isArray && descriptor1.length !== descriptor2.length) {
    return false
  }

  var smallerDescriptor = descriptor1.length <= descriptor2.length ? descriptor1 : descriptor2
  var largerDescriptor = descriptor2.length >= descriptor1.length ? descriptor2 : descriptor1
  return smallerDescriptor.keys.every(function (key) {
    return largerDescriptor.keys.includes(key)
  }) ? smallerDescriptor.details.every(function (detail) {
      return detail.type.some(function (type) {
        return largerDescriptor.details.find(function (foundDetail) {
          return foundDetail.key === detail.key
        }).type.includes(type)
      })
    }) : false
}

exports.compareDescriptor = compareDescriptor

var sameDescriptor = function sameDescriptor (descriptor1, descriptor2) {
  return descriptor1.details.every(function (detail, index) {
    return detail.value.some(function (dVal) {
      return descriptor2.details[index].value.includes(dVal)
    })
  })
}

exports.sameDescriptor = sameDescriptor

var tempDescriptorReference = function tempDescriptorReference (descriptor, mapIndex) {
  return {
    tempDescriptor: descriptor,
    refIndex: mapIndex
  }
}
/**
 * Trace out the entire object including nested objects.
 * @function
 * @param {Object|Array} object
 * @param {number} [mapLimit=1000]
 * @param {number} [depthLimit=-1]
 * @returns {module:descriptorSamples~descriptorMap}
 */

var describeObjectMap = function describeObjectMap (object) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}
  var _ref$mapLimit = _ref.mapLimit
  var mapLimit = _ref$mapLimit === void 0 ? 1000 : _ref$mapLimit
  var _ref$depthLimit = _ref.depthLimit
  var depthLimit = _ref$depthLimit === void 0 ? -1 : _ref$depthLimit

  var descriptorMap = [describeObject(object)]
  descriptorMap[0].index = 0

  var describeReferences = function describeReferences (descriptor, limit) {
    descriptor.references = descriptor.references.map(function (referenceId) {
      var index = descriptorMap.length
      var val = descriptor.details[referenceId].value[descriptor.details[referenceId].value.length - 1]

      if (_typeof(val) !== 'object' || val === null || typeof val === 'undefined' || descriptor.details[referenceId].circular) {
        return referenceId
      }

      var tempDescriptor = describeObject(val)
      var existingDescriptorIndex = descriptorMap.findIndex(function (existingDescriptor) {
        return compareDescriptor(tempDescriptor, existingDescriptor)
      })

      if (existingDescriptorIndex >= 0) {
        index = existingDescriptorIndex

        if (sameDescriptor(tempDescriptor, descriptorMap[existingDescriptorIndex])) {
          descriptor = descriptorMap[existingDescriptorIndex]
          descriptor.details[referenceId].circular = true
        }
      }

      if (index >= mapLimit) {
        return referenceId
      }

      if (limit === 0) {
        return referenceId
      }

      if (tempDescriptor.isArray) {
        var _descriptor$details$r

        index = (_descriptor$details$r = descriptor.details[referenceId].arrayReference) !== null && _descriptor$details$r !== void 0 ? _descriptor$details$r : index
        descriptor.details[referenceId].arrayReference = tempDescriptorReference(tempDescriptor, index)
      } else {
        var _descriptor$details$r2

        index = (_descriptor$details$r2 = descriptor.details[referenceId].objectReference) !== null && _descriptor$details$r2 !== void 0 ? _descriptor$details$r2 : index
        descriptor.details[referenceId].objectReference = tempDescriptorReference(tempDescriptor, index)
      }

      tempDescriptor.index = index

      if (existingDescriptorIndex < 0) {
        descriptorMap[index] = descriptorMap[index] ? assignDescriptor(descriptorMap[index], tempDescriptor) : tempDescriptor
      }

      return referenceId
    })
    descriptor.references = descriptor.references.map(function (referenceId) {
      var tempDescriptor = null
      var refIndex = -1

      if (descriptor.details[referenceId].arrayReference !== null) {
        ;
        var _descriptor$details$r3 = descriptor.details[referenceId].arrayReference
        tempDescriptor = _descriptor$details$r3.tempDescriptor
        refIndex = _descriptor$details$r3.refIndex
        descriptor.details[referenceId].arrayReference = refIndex
      }

      if (descriptor.details[referenceId].objectReference !== null) {
        ;
        var _descriptor$details$r4 = descriptor.details[referenceId].objectReference
        tempDescriptor = _descriptor$details$r4.tempDescriptor
        refIndex = _descriptor$details$r4.refIndex
        descriptor.details[referenceId].objectReference = refIndex
      }

      if (tempDescriptor === null) {
        return referenceId
      }

      if (!descriptorMap[refIndex]) {
        return referenceId
      }

      descriptorMap[refIndex] = assignDescriptor(descriptorMap[refIndex], tempDescriptor)

      if (!descriptor.details[referenceId].circular) {
        describeReferences(tempDescriptor, --limit)
      }

      return referenceId
    })
    descriptor.complete = descriptor.references.every(function (refId) {
      return [descriptor.details[refId].arrayReference, descriptor.details[refId].objectReference].some(function (ref) {
        return typeof ref === 'number'
      })
    })
    descriptorMap[descriptor.index] = assignDescriptor(descriptorMap[descriptor.index], descriptor)
    return descriptorMap
  }

  return describeReferences(descriptorMap[0], depthLimit)
}
/**
 * @typedef {Object.<string, number|Object|Array} referenceIdentifier
 * @property {number} index
 * @property {Array|Object} object
 * @property {descriptor} descriptor
 * @property {Array.<string|number>} references
 * @property {Array.<string|number>} circular
 */

/**
 * Create a referenceIdentifier for building the object clone.
 * @param {Array|Object} [object=null]
 * @param {number} [index=0]
 * @returns {referenceIdentifier}
 */

exports.describeObjectMap = describeObjectMap

var createReferenceIdentifier = function createReferenceIdentifier () {
  var object = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null
  var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0
  return Object.assign({}, {
    index: index,
    object: object,
    descriptor: describeObject(object || {}),
    references: [],
    circular: []
  })
}
/**
 * Prepare to map over an object and return the callback that will be used for each reference.
 * @function
 * @param {descriptorMap} descriptorMap
 * @param {Array.<referenceIdentifier>} newReferenceMap
 * @returns {mapOriginal}
 */

var mapOriginalObject = function mapOriginalObject () {
  var descriptorMap = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null
  var newReferenceMap = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : []

  var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {}
  var _ref2$mapLimit = _ref2.mapLimit
  var mapLimit = _ref2$mapLimit === void 0 ? 1000 : _ref2$mapLimit
  var _ref2$depthLimit = _ref2.depthLimit
  var depthLimit = _ref2$depthLimit === void 0 ? -1 : _ref2$depthLimit

  /**
   * Map over the provided object and generate an array of cloned references.
   * @function
   * @param {Array|Object} focusObject
   * @param {descriptor} descriptor
   * @returns {Array.<referenceIdentifier>}
   */
  var mapOriginal = function mapOriginal (focusObject, descriptor) {
    var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0
    var limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null

    if (limit === null) {
      limit = depthLimit
    }

    if (!newReferenceMap[index]) {
      newReferenceMap[index] = createReferenceIdentifier(focusObject, index)
    }

    if (descriptor.isArray && Array.isArray(focusObject)) {
      var detail = descriptor.details[0]
      newReferenceMap[index].object = focusObject.map(function (item, id) {
        if (!detail.isReference) {
          return item
        }

        if (detail.isReference && notEmptyObjectOrArray(item)) {
          newReferenceMap[index].references.push(id)
          return null
        }

        return Array.isArray(item) ? [] : {}
      }, [])
    } else {
      newReferenceMap[index].object = descriptor.details.reduce(function (newRef, detail) {
        if (!(detail.key in focusObject)) {
          return newRef
        }

        if (_typeof(focusObject[detail.key]) !== 'object' || focusObject[detail.key] === null) {
          newRef[detail.key] = focusObject[detail.key]
          return newRef
        }

        if (detail.isReference && notEmptyObjectOrArray(focusObject[detail.key])) {
          newReferenceMap[index].references.push(detail.key)
          newRef[detail.key] = null
          return newRef
        }

        newRef[detail.key] = Array.isArray(focusObject[detail.key]) ? [] : {}
        return newRef
      }, {})
    }

    newReferenceMap[index] = newReferenceMap[index].references.reduce(function (newRef, key) {
      var detail = descriptor.isArray ? descriptor.details[0] : descriptor.details.find(function (detail) {
        return detail.key === key
      })
      var newRefIndex = newReferenceMap.length
      var objectToRef = focusObject[key]

      if (detail.circular) {
        var tempDescriptor = describeObject(objectToRef)
        var existingIndex = newReferenceMap.findIndex(function (existing) {
          return sameDescriptor(tempDescriptor, existing.descriptor)
        })
        newRef.object[key] = existingIndex
        newRef.circular.push(key)
        return newRef
      }

      if (newRefIndex >= mapLimit) {
        newRef.object[key] = Array.isArray(focusObject[key]) ? [] : {}
        return newRef
      }

      if (limit === 0) {
        return newReferenceMap[index]
      }

      newReferenceMap[newRefIndex] = createReferenceIdentifier(focusObject[key], newRefIndex)
      newRef.object[key] = newRefIndex
      return newRef
    }, newReferenceMap[index])
    return newReferenceMap[index].references.reduce(function (newRef, key) {
      if (typeof newRef.object[key] !== 'number') {
        return newRef
      }

      var detail = descriptor.isArray ? descriptor.details[0] : descriptor.details.find(function (detail) {
        return detail.key === key
      })

      if (detail.circular) {
        return newRef
      }

      var objectToRef = focusObject[key]
      var descriptorRefIndex = Array.isArray(objectToRef) && detail.arrayReference ? detail.arrayReference : detail.objectReference
      newReferenceMap[newRef.object[key]] = mapOriginal(objectToRef, descriptorMap[descriptorRefIndex], newRef.object[key], --limit)
      return newRef
    }, newReferenceMap[index])
  }

  return mapOriginal
}
/**
 * Take an array for reference identifiers and return a callback to build the final reference
 * @param {Array.<referenceIdentifier>} newReferenceMap
 * @returns {assignReferences}
 */

exports.mapOriginalObject = mapOriginalObject

var assignNewReferences = function assignNewReferences () {
  var newReferenceMap = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : []

  /**
   * Take a reference identifier and return a new reference.
   * @function
   * @param {referenceIdentifier} reference
   * @returns {Array|Object}
   */
  var assignReferences = function assignReferences (reference) {
    return reference.references.reduce(function (newRef, key) {
      newRef[key] = reference.circular.includes(key) ? newReferenceMap[newRef[key]].object : assignReferences(newReferenceMap[newRef[key]])
      return newRef
    }, reference.object)
  }

  return assignReferences
}
/**
 * Clone objects for manipulation without data corruption, returns a copy of the provided object.
 * @function
 * @param {Object} object - The original object that is being cloned
 * @param {module:descriptorSamples~descriptorMap} descriptorMap - The map of the object
 * @returns {Object}
 */

exports.assignNewReferences = assignNewReferences

var cloneObject = function cloneObject (object) {
  var descriptorMap = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : []

  if (!descriptorMap.length) {
    descriptorMap = describeObjectMap(object)
  }

  var newReferenceMap = []
  newReferenceMap[0] = mapOriginalObject(descriptorMap, newReferenceMap)(object, descriptorMap[0])
  return assignNewReferences(newReferenceMap)(newReferenceMap[0])
}
/**
 * Merge two objects and provide clone or original on the provided function.
 * The passed function should accept a minimum of two objects to be merged.
 * If the desire is to mutate the input objects, then the function name should
 * have the word 'mutable' in the name (case-insensitive).
 * @function
 * @param {boolean} isMutable - An optional flag which indicates whether we will clone objects or directly
 * @param {module:objectHelpers.mergeObjects|module:objectHelpers.mergeObjectsMutable|Function} fn - Pass one of
 * the mergeObjects functions to be used
 * @param {Object} obj1 - The receiving object; this is the object which will have it's properties overridden
 * @param {Object} obj2 - The contributing object; this is the object which will contribute new properties and
 * override existing ones
 * modify them
 * @returns {Object}
 */

exports.cloneObject = cloneObject

var mergeObjectsBase = function mergeObjectsBase (isMutable, fn, obj1, obj2) {
  return notEmptyObjectOrArray(obj2) ? mapObject(obj2, function (prop, key) {
    return obj1[key] ? fn(obj1[key], prop) : prop
  }, isMutable ? obj1 : cloneObject(obj1)) : obj2
}
/**
 * Perform a deep merge of objects. This will combine all objects and sub-objects,
 * objects having the same attributes will overwrite starting from the end of the argument
 * list and bubbling up to return a merged version of the first object.
 * WARNING: This is a recursive function.
 * @function
 * @param {...Object} args - Provide a list of objects which will be merged starting from the end up into the first
 * object
 * @returns {Object}
 */

var mergeObjects = function mergeObjects () {
  for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2]
  }

  return args.length === 2 ? mergeObjectsBase(false, mergeObjects, args[0], args[1]) : args.length === 1 ? cloneObject(args[0]) : args.reduce((0, _functions.curry)(mergeObjectsBase)(false, mergeObjects), {})
}
/**
 * Perform a deep merge of objects. This will combine all objects and sub-objects,
 * objects having the same attributes will overwrite starting from the end of the argument
 * list and bubbling up to return the overwritten first object.
 * WARNING: This is a recursive function.
 * WARNING: This will mutate the first object passed in as input
 * @function
 * @param {...Object} args - Provide a list of objects which will be merged starting from the end up into the first
 * object
 * @returns {Object}
 */

exports.mergeObjects = mergeObjects

var mergeObjectsMutable = function mergeObjectsMutable () {
  for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3]
  }

  return args.length === 2 ? mergeObjectsBase(true, mergeObjectsMutable, args[0], args[1]) : args.length === 1 ? args[0] : args.reduce((0, _functions.curry)(mergeObjectsBase)(true, mergeObjectsMutable), {})
}

exports.mergeObjectsMutable = mergeObjectsMutable

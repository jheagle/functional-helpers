/**
 * Create a format to standarize every object into a specific template.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 * @module objectDescriptors
 */

import 'core-js/stable'
import { compareArrays, uniqueArray } from '../arrays'
import { emptyObject, isCloneable, isInstanceObject, objectKeys, setValue } from '../objects'

/**
 * Trace an object's attribute and provide details about it.
 * @function
 * @param {*} value
 * @param {string|number} [key=0]
 * @param {number} [index=0]
 * @returns {module:descriptorSamples~descriptorDetail}
 */
export const describeObjectDetail = (value, key = 0, index = 0) => {
  const type = (typeof value)
  return {
    index: index,
    key: key,
    type: [type],
    value: [value],
    nullable: value === null,
    optional: false,
    circular: false,
    isReference: isCloneable(value) && !emptyObject(value),
    isInstance: isInstanceObject(value),
    arrayReference: null,
    objectReference: null
  }
}

/**
 * Get a new copy of an existing Descriptor Detail
 * @param {module:descriptorSamples~descriptorDetail} originalDetail
 * @returns {module:descriptorSamples~descriptorDetail}
 */
const cloneDescriptorDetail = originalDetail => {
  const copyDetail = {}
  objectKeys(originalDetail).forEach(key => {
    copyDetail[key] = Array.isArray(originalDetail[key])
      ? originalDetail[key].map(value => value)
      : originalDetail[key]
  })
  return copyDetail
}

/**
 * Make a copy of an object descriptor so that the original will not be mutated.
 * @function
 * @param {module:descriptorSamples~descriptor} originalMap
 * @returns {module:descriptorSamples~descriptor}
 */
const cloneDescriptor = originalMap => {
  const copyMap = {}
  copyMap.index = originalMap.index || 0
  copyMap.details = originalMap.details.map(cloneDescriptorDetail)
  copyMap.length = originalMap.length
  copyMap.keys = originalMap.keys.map(key => key)
  copyMap.references = originalMap.references.map(reference => reference)
  copyMap.isArray = originalMap.isArray
  copyMap.complete = originalMap.complete
  return copyMap
}

/**
 * Assign properties from other details onto an existing detail.
 * @param {module:descriptorSamples~descriptorDetail} originalDetail
 * @param  {...module:descriptorSamples~descriptorDetail} details
 * @returns {module:descriptorSamples~descriptorDetail}
 */
const assignDescriptorDetail = (originalDetail, ...details) => details.reduce(
  (existingDetail, newDetail) => {
    existingDetail.type = uniqueArray([...existingDetail.type, ...newDetail.type])
    existingDetail.value = uniqueArray([...existingDetail.value, ...newDetail.value])
    existingDetail.nullable = existingDetail.nullable || newDetail.nullable
    existingDetail.optional = existingDetail.optional || newDetail.optional
    existingDetail.circular = existingDetail.circular || newDetail.circular
    existingDetail.isReference = existingDetail.isReference || newDetail.isReference
    existingDetail.isInstance = existingDetail.isInstance || newDetail.isInstance
    existingDetail.arrayReference = [existingDetail.arrayReference, newDetail.arrayReference].find(ref => typeof ref === 'number')
    existingDetail.objectReference = [existingDetail.objectReference, newDetail.objectReference].find(ref => typeof ref === 'number')
    existingDetail.arrayReference = (typeof existingDetail.arrayReference === 'undefined')
      ? null
      : existingDetail.arrayReference
    existingDetail.objectReference = (typeof existingDetail.objectReference === 'undefined')
      ? null
      : existingDetail.objectReference
    return existingDetail
  }, cloneDescriptorDetail(originalDetail))

/**
 * Apply one or more descriptors to an existing descriptor so that they represent a merged version of the descriptors.
 * @function
 * @param {module:descriptorSamples~descriptor} originalMap
 * @param  {...module:descriptorSamples~descriptor} descriptors
 * @returns {module:descriptorSamples~descriptor}
 */
export const assignDescriptor = (originalMap, ...descriptors) => descriptors.reduce((assignedDescriptor, descriptor) => {
  const detailsDiff = compareArrays(assignedDescriptor.keys, descriptor.keys)
  detailsDiff.forEach(diff => {
    const existingDetail = assignedDescriptor.details.find(detail => detail.key === diff.value)
    const newDetail = descriptor.details.find(detail => detail.key === diff.value)
    if (diff.result.every(result => result === 0)) {
      assignedDescriptor.details[existingDetail.index] = assignDescriptorDetail(existingDetail, newDetail)
      return assignedDescriptor
    }
    const useDetail = diff[0] > 0 ? existingDetail : newDetail
    if (!useDetail) {
      assignedDescriptor.details[existingDetail.index].optional = true
      return assignedDescriptor
    }
    const useIndex = diff[0] > 0 ? useDetail.index : assignedDescriptor.length
    assignedDescriptor.details[useIndex] = Object.assign({}, useDetail, {
      index: useIndex,
      optional: true
    })
    assignedDescriptor.length = assignedDescriptor.length < assignedDescriptor.details.length
      ? assignedDescriptor.details.length
      : assignedDescriptor.length
    return assignedDescriptor
  })
  assignedDescriptor.keys = uniqueArray(assignedDescriptor.details.map(detail => detail.key))
  assignedDescriptor.references = uniqueArray(assignedDescriptor.details.filter(detail => detail.isReference).map(detail => detail.index))
  assignedDescriptor.isArray = assignedDescriptor.length
    ? assignedDescriptor.details.every(detail => (typeof detail.key === 'number'))
    : assignedDescriptor.isArray
  assignedDescriptor.complete = !assignedDescriptor.references.length || assignedDescriptor.complete || descriptor.complete
  return assignedDescriptor
}, cloneDescriptor(originalMap))

/**
 * Trace an object and return the descriptor which defines the object's structure and attributes.
 * @function
 * @param {Object} object
 * @returns {module:descriptorSamples~descriptor}
 */
export const describeObject = object => {
  const descriptor = {
    index: 0,
    details: [],
    length: 0,
    keys: [],
    references: [],
    isArray: false,
    complete: false
  }
  const keys = objectKeys(object)
  for (let i = 0; i < keys.length; ++i) {
    const key = keys[i]
    const newDetail = describeObjectDetail(object[key], key, descriptor.length++)
    if (typeof key === 'number' && descriptor.details.length) {
      descriptor.details[0] = assignDescriptorDetail(descriptor.details[0], newDetail)
      descriptor.keys = [0]
      if (newDetail.isReference) {
        descriptor.references = [0]
      }
      continue
    }
    descriptor.details.push(newDetail)
    descriptor.keys.push(newDetail.key)
    if (newDetail.isReference) {
      descriptor.references.push(newDetail.index)
    }
  }
  descriptor.isArray = Array.isArray(object)
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
export const compareDescriptor = (descriptor1, descriptor2) => {
  if (descriptor1.isArray !== descriptor2.isArray) {
    return false
  }
  if (descriptor1.length === 0 || descriptor2.length === 0) {
    return descriptor1.length === descriptor2.length
  }
  const smallerDescriptor = descriptor1.length <= descriptor2.length ? descriptor1 : descriptor2
  const largerDescriptor = descriptor2.length >= descriptor1.length ? descriptor2 : descriptor1
  return smallerDescriptor.keys.every(key => largerDescriptor.keys.includes(key))
    ? smallerDescriptor.details.every(detail => detail.type.some(type => largerDescriptor.details.find(foundDetail => foundDetail.key === detail.key).type.includes(type)))
    : false
}

export const sameDescriptor = (descriptor1, descriptor2) => descriptor1.details.every((detail, index) => detail.value.some(dVal => descriptor2.details[index].value.includes(dVal)))

/**
 * Find the index of the next descriptorDetail to build a resource for.
 * @param {module:descriptorSamples~descriptor} descriptor
 * @param {number} currentReference
 * @returns {number|undefined}
 */
const nextReference = (descriptor, currentReference) => descriptor.references.find(
  nextRef => {
    if (nextRef <= currentReference) {
      return false
    }
    const val = descriptor.details[nextRef].value[descriptor.details[nextRef].value.length - 1]
    if (typeof val !== 'object' || val === null || typeof val === 'undefined' || descriptor.details[nextRef].circular || descriptor.details[nextRef].isInstance) {
      return false
    }
    return !!objectKeys(val).length
  }
)

/**
 * Check if the descriptors references have all been built and set complete to true if they have.
 * @param {module:descriptorSamples~descriptor} descriptor
 * @returns {module:descriptorSamples~descriptor}
 */
const checkDescriptorComplete = (descriptor) => setValue(
  'complete',
  descriptor.references
    .every(
      refId => [
        descriptor.details[refId].arrayReference,
        descriptor.details[refId].objectReference
      ].some(ref => typeof ref === 'number')
    ),
  descriptor
)

/**
 * Check if we should clear the values on this descriptor
 * @param {module:descriptorSamples~descriptor} descriptor
 * @param {boolean} [keepValues=false]
 * @returns {module:descriptorSamples~descriptor}
 */
const checkClearValues = (descriptor, keepValues = false) => setValue(
  'details',
  (descriptor.complete && !keepValues)
    ? descriptor.details.map(
      detail => setValue('value', [], detail)
    )
    : descriptor.details,
  descriptor
)

/**
 * Trace out the entire object including nested objects.
 * @function
 * @param {Object|Array} object
 * @param {Object} [options={}]
 * @param {number} [options.mapLimit=1000000000]
 * @param {number} [options.depthLimit=-1]
 * @param {boolean} [options.keepValues=false]
 * @returns {module:descriptorSamples~descriptorMap}
 */
export const describeObjectMap = (object, { mapLimit = 1000000000, depthLimit = -1, keepValues = false } = {}) => {
  const descriptorMap = [describeObject(object)]
  descriptorMap[0].index = 0
  const describeReferences = (descriptor, currentDetail, limit = -1, returnCallback = returnMap => returnMap) => {
    let index = descriptorMap.length
    const nextRef = currentDetail ? nextReference(descriptor, currentDetail.index) : undefined
    const nextDetail = (typeof nextRef !== 'undefined') ? descriptor.details[nextRef] : null
    if (currentDetail) {
      const vals = descriptor.isArray ? currentDetail.value : [currentDetail.value[currentDetail.value.length - 1]]
      vals.forEach(val => {
        const tempDescriptor = describeObject(val)
        const existingDescriptorIndex = descriptorMap.findIndex(existingDescriptor => compareDescriptor(tempDescriptor, existingDescriptor))
        if (existingDescriptorIndex >= 0) {
          index = existingDescriptorIndex
          if (tempDescriptor.length && sameDescriptor(tempDescriptor, descriptorMap[existingDescriptorIndex])) {
            currentDetail.circular = true
            descriptor.details[currentDetail.index] = currentDetail
          }
        }
        if (index >= mapLimit) {
          return descriptorMap
        }
        if (limit === 0) {
          return descriptorMap
        }
        if (tempDescriptor.isArray) {
          index = currentDetail.arrayReference ?? index
          descriptor.details[currentDetail.index].arrayReference = index
        } else {
          index = currentDetail.objectReference ?? index
          descriptor.details[currentDetail.index].objectReference = index
        }
        tempDescriptor.index = index
        if (existingDescriptorIndex < 0) {
          descriptorMap[index] = descriptorMap[index]
            ? assignDescriptor(descriptorMap[index], tempDescriptor)
            : tempDescriptor
        }
        descriptorMap[descriptor.index] = assignDescriptor(descriptorMap[descriptor.index], descriptor)
        currentDetail = descriptorMap[descriptor.index].details.find(
          detail => detail.key === currentDetail.key
        )
        if (!currentDetail.circular) {
          const newReference = nextReference(tempDescriptor, -1)
          const newDetail = (typeof newReference !== 'undefined') ? tempDescriptor.details[newReference] : null
          return describeReferences(tempDescriptor, newDetail, --limit, returnMap => describeReferences(descriptor, nextDetail, --limit)
          )
        }
      })
    }
    descriptorMap[descriptor.index] = assignDescriptor(
      descriptorMap[descriptor.index],
      checkDescriptorComplete(descriptor)
    )
    descriptorMap[descriptor.index] = checkClearValues(descriptorMap[descriptor.index], keepValues)
    return nextDetail
      ? describeReferences(descriptor, nextDetail, --limit)
      : returnCallback(descriptorMap)
  }
  const descriptor = descriptorMap[0]
  const currentReference = nextReference(descriptor, -1)
  if (typeof currentReference === 'undefined') {
    descriptorMap[0] = assignDescriptor(descriptorMap[0], checkDescriptorComplete(descriptor, keepValues))
    descriptorMap[0] = checkClearValues(descriptorMap[0], keepValues)
    return descriptorMap
  }
  return describeReferences(descriptor, descriptor.details[currentReference], depthLimit)
}

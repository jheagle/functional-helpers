import functionalHelpers from '../dist/main'

test('Generated main browser file exports intended functions', () => {
  expect(Object.keys(functionalHelpers).length).toEqual(29)
  expect(typeof functionalHelpers.noConflict).toBe('function')
  expect(typeof functionalHelpers.buildArray).toBe('function')
  expect(typeof functionalHelpers.buildArrayOfReferences).toBe('function')
  expect(typeof functionalHelpers.uniqueArray).toBe('function')
  expect(typeof functionalHelpers.mergeArrays).toBe('function')
  expect(typeof functionalHelpers.compareArrays).toBe('function')
  expect(typeof functionalHelpers.curry).toBe('function')
  expect(typeof functionalHelpers.pipe).toBe('function')
  expect(typeof functionalHelpers.callWithParams).toBe('function')
  expect(typeof functionalHelpers.queueTimeout).toBe('function')
  expect(typeof functionalHelpers.getAbsoluteMax).toBe('function')
  expect(typeof functionalHelpers.getAbsoluteMin).toBe('function')
  expect(typeof functionalHelpers.randomNumber).toBe('function')
  expect(typeof functionalHelpers.randomInteger).toBe('function')
  expect(typeof functionalHelpers.compare).toBe('function')
  expect(typeof functionalHelpers.setValue).toBe('function')
  expect(typeof functionalHelpers.setAndReturnValue).toBe('function')
  expect(typeof functionalHelpers.mapObject).toBe('function')
  expect(typeof functionalHelpers.mapProperty).toBe('function')
  expect(typeof functionalHelpers.filterObject).toBe('function')
  expect(typeof functionalHelpers.reduceObject).toBe('function')
  expect(typeof functionalHelpers.notEmptyObjectOrArray).toBe('function')
  expect(typeof functionalHelpers.traceObjectDetail).toBe('function')
  expect(typeof functionalHelpers.traceObject).toBe('function')
  expect(typeof functionalHelpers.cloneObject).toBe('function')
  expect(typeof functionalHelpers.mergeObjects).toBe('function')
  expect(typeof functionalHelpers.mergeObjectsMutable).toBe('function')
})

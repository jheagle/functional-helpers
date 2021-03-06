import * as helpers from '../dist/helpers/arrays'

describe('buildArray', () => {
  test('generates an array filled with given item clones of the specified length', () => {
    const someItem = { name: 'something' }
    const result = helpers.buildArray(someItem, 4)
    expect(result[0]).not.toBe(someItem)
    someItem.name = 'different'
    result[1] = someItem
    expect(result[0]).toEqual({ name: 'something' })
    expect(result[1]).toEqual({ name: 'different' })
    expect(result[2]).toEqual({ name: 'something' })
    expect(result[3]).toEqual({ name: 'something' })
  })
})

describe('buildArrayOfReferences', () => {
  test('generates an array filled with reference to items of the specified length', () => {
    const someItem = { name: 'something' }
    const result = helpers.buildArrayOfReferences(someItem, 4)
    expect(result[0]).toBe(someItem)
    expect(result[1]).toBe(someItem)
    expect(result[2]).toBe(someItem)
    expect(result[3]).toBe(someItem)
    someItem.name = 'different'
    expect(result[0]).toEqual({ name: 'different' })
    expect(result[1]).toEqual({ name: 'different' })
    expect(result[2]).toEqual({ name: 'different' })
    expect(result[3]).toEqual({ name: 'different' })
  })
})

describe('uniqueArray', () => {
  test('removes duplicates from array', () => {
    expect(helpers.uniqueArray(
      ['match1', 'match2', 'secondMismatch1', 'badMatch1', 'badMatch1']
    )).toEqual(['match1', 'match2', 'secondMismatch1', 'badMatch1'])
  })
})

describe('mergeArrays', () => {
  test('returns unique merged values from multiple arrays', () => {
    expect(helpers.mergeArrays(
      ['match1', 'firstMismatch1', 'match2', 'firstMismatch2', 'badMatch1'],
      ['match1', 'match2', 'secondMismatch1', 'badMatch1', 'badMatch1']
    )).toEqual(['match1', 'firstMismatch1', 'match2', 'firstMismatch2', 'badMatch1', 'secondMismatch1'])
  })
})

describe('compareArrays', () => {
  test('returns correct boolean', () => {
    expect(helpers.compareArrays(
      ['match1', 'firstMismatch1', 'match2', 'firstMismatch2', 'badMatch1'],
      ['match1', 'match2', 'secondMismatch1', 'badMatch1', 'badMatch1']
    )).toEqual([
      {
        value: 'match1',
        keys: [[0], [0]],
        result: [0, 0]
      },
      {
        value: 'firstMismatch1',
        keys: [[1], []],
        result: [1, -1]
      },
      {
        value: 'match2',
        keys: [[2], [1]],
        result: [0, 0]
      },
      {
        value: 'firstMismatch2',
        keys: [[3], []],
        result: [1, -1]
      },
      {
        value: 'badMatch1',
        keys: [[4], [3, 4]],
        result: [0, 0]
      },
      {
        value: 'secondMismatch1',
        keys: [[], [2]],
        result: [-1, 1]
      }
    ])
  })
})

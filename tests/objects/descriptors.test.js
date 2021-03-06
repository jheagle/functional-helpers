import * as helpers from '../../dist/helpers/objects/descriptors'
import * as samples from '../../dist/helpers/objects/descriptorSamples'
import { circularObject, deepReferenceObject, domItem, jsonDom, linkedList, multiReferenceObject, nodeTree } from '../testHelpers'

describe('describeObjectDetail generates detail for', () => {
  test('undefined type', () => {
    expect(helpers.describeObjectDetail(undefined, 'anUndefined'))
      .toEqual({
        index: 0,
        key: 'anUndefined',
        type: ['undefined'],
        value: [undefined],
        nullable: false,
        optional: false,
        circular: false,
        isReference: false,
        isInstance: false,
        arrayReference: null,
        objectReference: null
      })
  })

  test('boolean type', () => {
    expect(helpers.describeObjectDetail(true, 'aBoolean'))
      .toEqual({
        index: 0,
        key: 'aBoolean',
        type: ['boolean'],
        value: [true],
        nullable: false,
        optional: false,
        circular: false,
        isReference: false,
        isInstance: false,
        arrayReference: null,
        objectReference: null
      })
  })

  test('number type', () => {
    expect(helpers.describeObjectDetail(34, 'aNumber'))
      .toEqual({
        index: 0,
        key: 'aNumber',
        type: ['number'],
        value: [34],
        nullable: false,
        optional: false,
        circular: false,
        isReference: false,
        isInstance: false,
        arrayReference: null,
        objectReference: null
      })
  })

  test('string type', () => {
    expect(helpers.describeObjectDetail('someString', 'aString'))
      .toEqual({
        index: 0,
        key: 'aString',
        type: ['string'],
        value: ['someString'],
        nullable: false,
        optional: false,
        circular: false,
        isReference: false,
        isInstance: false,
        arrayReference: null,
        objectReference: null
      })
  })

  test('bigint type', () => {
    expect(helpers.describeObjectDetail(9007199254740992n, 'aBigInt'))
      .toEqual({
        index: 0,
        key: 'aBigInt',
        type: ['bigint'],
        value: [9007199254740992n],
        nullable: false,
        optional: false,
        circular: false,
        isReference: false,
        isInstance: false,
        arrayReference: null,
        objectReference: null
      })
  })

  test('symbol type', () => {
    const sym1 = Symbol('sym')
    expect(helpers.describeObjectDetail(sym1, 'aSymbol'))
      .toEqual({
        index: 0,
        key: 'aSymbol',
        type: ['symbol'],
        value: [sym1],
        nullable: false,
        optional: false,
        circular: false,
        isReference: false,
        isInstance: false,
        arrayReference: null,
        objectReference: null
      })
  })

  test('null type', () => {
    expect(helpers.describeObjectDetail(null, 'aNull'))
      .toEqual({
        index: 0,
        key: 'aNull',
        type: ['object'],
        value: [null],
        nullable: true,
        optional: false,
        circular: false,
        isReference: false,
        isInstance: false,
        arrayReference: null,
        objectReference: null
      })
  })

  test('object type', () => {
    const someObject = { item: 'something' }
    expect(helpers.describeObjectDetail(someObject, 'anObject'))
      .toEqual({
        index: 0,
        key: 'anObject',
        type: ['object'],
        value: [someObject],
        nullable: false,
        optional: false,
        circular: false,
        isReference: true,
        isInstance: false,
        arrayReference: null,
        objectReference: null
      })

    const someArray = ['a', 'b', 'c']
    expect(helpers.describeObjectDetail(someArray, 'anArray'))
      .toEqual({
        index: 0,
        key: 'anArray',
        type: ['object'],
        value: [someArray],
        nullable: false,
        optional: false,
        circular: false,
        isReference: true,
        isInstance: false,
        arrayReference: null,
        objectReference: null
      })
  })

  test('function type', () => {
    const someFunction = () => true
    expect(helpers.describeObjectDetail(someFunction, 'aFunction'))
      .toEqual({
        index: 0,
        key: 'aFunction',
        type: ['function'],
        value: [someFunction],
        nullable: false,
        optional: false,
        circular: false,
        isReference: false,
        isInstance: true,
        arrayReference: null,
        objectReference: null
      })
  })

  test('sample object detail with string', () => {
    expect(helpers.describeObjectDetail('', 'keyName'))
      .toEqual(samples.descriptorDetailSample)
  })

  test('sample object detail with class instance object', () => {
    const dateObject = new Date()
    expect(helpers.describeObjectDetail(dateObject, 'aDate'))
      .toEqual({
        index: 0,
        key: 'aDate',
        type: ['object'],
        value: [dateObject],
        nullable: false,
        optional: false,
        circular: false,
        isReference: false,
        isInstance: true,
        arrayReference: null,
        objectReference: null
      })
  })

  test('sample object detail with created instance object', () => {
    const someObject = { item: 'something' }
    const newObject = Object.create(someObject)
    expect(helpers.describeObjectDetail(newObject, 'anObject'))
      .toEqual({
        index: 0,
        key: 'anObject',
        type: ['object'],
        value: [newObject],
        nullable: false,
        optional: false,
        circular: false,
        isReference: false,
        isInstance: true,
        arrayReference: null,
        objectReference: null
      })
  })
})

describe('assignDescriptor', () => {
  test('assigns new value on same detail', () => {
    expect(helpers.assignDescriptor(samples.descriptorSample, helpers.describeObject({ keyName: 'someString' })))
      .toMatchObject({
        details: [
          {
            key: 'keyName',
            type: ['string'],
            value: ['', 'someString']
          }
        ],
        length: 1,
        keys: ['keyName'],
        references: [],
        isArray: false,
        complete: true
      })
  })

  test('assigns empty array detail to filled array detail', () => {
    const childOne = { name: 'child one' }
    const childTwo = { name: 'child two' }
    const children = helpers.describeObject([childOne, childTwo])
    const noChildren = helpers.describeObject([])
    expect(helpers.assignDescriptor(children, noChildren))
      .toMatchObject({
        details: [
          {
            key: 0,
            type: ['object'],
            value: [childOne, childTwo]
          }
        ],
        length: 2,
        keys: [0],
        references: [0],
        isArray: true,
        complete: true
      })
  })
})

describe('describeObject', () => {
  test('will create empty object description', () => {
    expect(helpers.describeObject({}))
      .toEqual({
        index: 0,
        details: [],
        length: 0,
        keys: [],
        references: [],
        isArray: false,
        complete: true
      })
  })

  test('will create empty array description', () => {
    expect(helpers.describeObject([]))
      .toEqual({
        index: 0,
        details: [],
        length: 0,
        keys: [],
        references: [],
        isArray: true,
        complete: true
      })
  })

  test('can produce structure matching sample with single string detail', () => {
    expect(helpers.describeObject({ keyName: '' }))
      .toEqual(samples.descriptorSample)
  })

  test('produces a simple descriptor of an object', () => {
    const someItem = { aString: 'someString', aNumber: 34, aBoolean: true, aNull: null, anUndefined: undefined }
    const descriptor = helpers.describeObject(someItem)
    expect(descriptor.details[0]).toEqual({
      index: 0,
      key: 'aString',
      type: ['string'],
      value: ['someString'],
      nullable: false,
      optional: false,
      circular: false,
      isReference: false,
      isInstance: false,
      arrayReference: null,
      objectReference: null
    })
    expect(descriptor.details[1]).toEqual({
      index: 1,
      key: 'aNumber',
      type: ['number'],
      value: [34],
      nullable: false,
      optional: false,
      circular: false,
      isReference: false,
      isInstance: false,
      arrayReference: null,
      objectReference: null
    })
    expect(descriptor.details[2]).toEqual({
      index: 2,
      key: 'aBoolean',
      type: ['boolean'],
      value: [true],
      nullable: false,
      optional: false,
      circular: false,
      isReference: false,
      isInstance: false,
      arrayReference: null,
      objectReference: null
    })
    expect(descriptor.details[3]).toEqual({
      index: 3,
      key: 'aNull',
      type: ['object'],
      value: [null],
      nullable: true,
      optional: false,
      circular: false,
      isReference: false,
      isInstance: false,
      arrayReference: null,
      objectReference: null
    })
    expect(descriptor.details[4]).toEqual({
      index: 4,
      key: 'anUndefined',
      type: ['undefined'],
      value: [undefined],
      nullable: false,
      optional: false,
      circular: false,
      isReference: false,
      isInstance: false,
      arrayReference: null,
      objectReference: null
    })
    expect(descriptor.length).toBe(5)
    expect(descriptor.references).toStrictEqual([])
    expect(descriptor.complete).toBe(true)
    expect(descriptor.isArray).toBe(false)
  })

  test('produces a simple descriptor of an array', () => {
    const someItem = ['someString', 34, true, null, undefined]
    const descriptor = helpers.describeObject(someItem)
    expect(descriptor.details[0]).toEqual({
      index: 0,
      key: 0,
      type: ['string', 'number', 'boolean', 'object', 'undefined'],
      value: ['someString', 34, true, null, undefined],
      nullable: true,
      optional: false,
      circular: false,
      isReference: false,
      isInstance: false,
      arrayReference: null,
      objectReference: null
    })
    expect(descriptor.length).toBe(5)
    expect(descriptor.references).toStrictEqual([])
    expect(descriptor.complete).toBe(true)
    expect(descriptor.isArray).toBe(true)
  })
})

describe('compareDescriptor; object-descriptors', () => {
  test('will return true for two exact match descriptors of objects', () => {
    expect(helpers.compareDescriptor(
      samples.descriptorSample,
      samples.descriptorSample
    )).toBe(true)
  })

  test('will return true for descriptor where all keys exist in another descriptor of an object', () => {
    expect(helpers.compareDescriptor(
      samples.descriptorSample,
      helpers.describeObject({ keyName: '', someNumber: 23 })
    )).toBe(true)
  })

  test('will return true when the smaller descriptor\'s keys exist in another descriptor of an object', () => {
    expect(helpers.compareDescriptor(
      helpers.describeObject({ keyName: '', someNumber: 23 }),
      samples.descriptorSample
    )).toBe(true)
  })

  test('will return false for descriptor where the keys exist but have a different type of an object', () => {
    expect(helpers.compareDescriptor(
      samples.descriptorSample,
      helpers.describeObject({ keyName: 23 })
    )).toBe(false)
  })

  test('will return false for descriptor where no keys match for an object', () => {
    expect(helpers.compareDescriptor(
      samples.descriptorSample,
      helpers.describeObject({ someName: '' })
    )).toBe(false)
  })

  test('will return false for the smallest descriptor when not all keys match the other descriptor for an object', () => {
    expect(helpers.compareDescriptor(
      helpers.describeObject({ keyName: '', someNumber: 23 }),
      helpers.describeObject({ keyName: '', someNull: null })
    )).toBe(false)
  })
})

describe('compareDescriptor; array-descriptors', () => {
  test('will return true for two exact match descriptors of arrays', () => {
    expect(helpers.compareDescriptor(
      helpers.describeObject(['']),
      helpers.describeObject([''])
    )).toBe(true)
  })

  test('will return true for the same type and length', () => {
    expect(helpers.compareDescriptor(
      helpers.describeObject(['', 1, null]),
      helpers.describeObject([23, '', 6])
    )).toBe(true)
  })

  test('will return false if second descriptor has length of 0 and first does not match', () => {
    expect(helpers.compareDescriptor(
      helpers.describeObject(['', 1]),
      helpers.describeObject([])
    )).toBe(false)
  })

  test('will return false for array descriptor comarison with object descriptor', () => {
    expect(helpers.compareDescriptor(
      helpers.describeObject(['']),
      helpers.describeObject({ 0: '' })
    )).toBe(false)
  })
})

describe('describeObjectMap', () => {
  test('can produce structure matching sample with single string detail', () => {
    expect(helpers.describeObjectMap({ keyName: '' }, { keepValues: true }))
      .toEqual(samples.descriptorMapSample)
  })

  test('can produce structure similar to sample mapped sample', () => {
    const descriptor = helpers.describeObject({ keyName: '' })
    const result = helpers.describeObjectMap(descriptor)
    expect(result)
      .toEqual(samples.mappedDescriptorMap)
  })

  test('object with self reference can be described', () => {
    const selfItem = { name: 'self', self: null }
    selfItem.self = selfItem
    expect(helpers.describeObjectMap(selfItem)).toEqual([
      {
        index: 0,
        details: [
          {
            index: 0,
            key: 'name',
            type: ['string'],
            value: [],
            nullable: false,
            optional: false,
            circular: false,
            isReference: false,
            isInstance: false,
            arrayReference: null,
            objectReference: null
          },
          {
            index: 1,
            key: 'self',
            type: ['object'],
            value: [],
            nullable: false,
            optional: false,
            circular: true,
            isReference: true,
            isInstance: false,
            arrayReference: null,
            objectReference: 0
          }
        ],
        length: 2,
        keys: ['name', 'self'],
        references: [1],
        isArray: false,
        complete: true
      }
    ])
  })

  test('able to describe and map linked list object with circular references', () => {
    expect(helpers.describeObjectMap(linkedList)).toEqual([
      {
        index: 0,
        details: [
          {
            index: 0,
            key: 'name',
            type: ['string'],
            value: [],
            nullable: false,
            optional: false,
            circular: false,
            isReference: false,
            isInstance: false,
            arrayReference: null,
            objectReference: null
          },
          {
            index: 1,
            key: 'prev',
            type: ['object'],
            value: [],
            nullable: true,
            optional: false,
            circular: true,
            isReference: true,
            isInstance: false,
            arrayReference: null,
            objectReference: 0
          },
          {
            index: 2,
            key: 'next',
            type: ['object'],
            value: [],
            nullable: true,
            optional: false,
            circular: false,
            isReference: true,
            isInstance: false,
            arrayReference: null,
            objectReference: 0
          }
        ],
        length: 3,
        keys: ['name', 'prev', 'next'],
        references: [1, 2],
        isArray: false,
        complete: true
      }
    ])
  })

  test('able to describe and map node tree object with circular references', () => {
    expect(helpers.describeObjectMap(nodeTree)).toEqual([
      {
        index: 0,
        details: [
          {
            index: 0,
            key: 'name',
            type: ['string'],
            value: [],
            nullable: false,
            optional: false,
            circular: false,
            isReference: false,
            isInstance: false,
            arrayReference: null,
            objectReference: null
          },
          {
            index: 1,
            key: 'parent',
            type: ['object'],
            value: [],
            nullable: true,
            optional: false,
            circular: true,
            isReference: true,
            isInstance: false,
            arrayReference: null,
            objectReference: 0
          },
          {
            index: 2,
            key: 'children',
            type: ['object'],
            value: [],
            nullable: false,
            optional: false,
            circular: false,
            isReference: true,
            isInstance: false,
            arrayReference: 1,
            objectReference: null
          }
        ],
        length: 3,
        keys: ['name', 'parent', 'children'],
        references: [1, 2],
        isArray: false,
        complete: true
      },
      {
        index: 1,
        details: [
          {
            index: 0,
            key: 0,
            type: ['object'],
            value: [],
            nullable: false,
            optional: false,
            circular: false,
            isReference: true,
            isInstance: false,
            arrayReference: null,
            objectReference: 0
          }
        ],
        length: 2,
        keys: [0],
        references: [0],
        isArray: true,
        complete: true
      }
    ])
  })

  test('object with empty nested array or object can link to reference', () => {
    expect(helpers.describeObjectMap(jsonDom)).toEqual([
      {
        index: 0,
        details: [
          {
            index: 0,
            key: 'tagName',
            type: ['string'],
            value: [],
            nullable: false,
            optional: false,
            circular: false,
            isReference: false,
            isInstance: false,
            arrayReference: null,
            objectReference: null
          },
          {
            index: 1,
            key: 'attributes',
            type: ['object'],
            value: [],
            nullable: false,
            optional: false,
            circular: false,
            isReference: true,
            isInstance: false,
            arrayReference: null,
            objectReference: 1
          },
          {
            index: 2,
            key: 'element',
            type: ['object'],
            value: [],
            nullable: false,
            optional: false,
            circular: false,
            isReference: false,
            isInstance: false,
            arrayReference: null,
            objectReference: null
          },
          {
            index: 3,
            key: 'eventListeners',
            type: ['object'],
            value: [],
            nullable: false,
            optional: false,
            circular: false,
            isReference: false,
            isInstance: false,
            arrayReference: null,
            objectReference: null
          },
          {
            index: 4,
            key: 'parentItem',
            type: ['object'],
            value: [],
            nullable: false,
            optional: false,
            circular: false,
            isReference: false,
            isInstance: false,
            arrayReference: null,
            objectReference: null
          },
          {
            index: 5,
            key: 'children',
            type: ['object'],
            value: [],
            nullable: false,
            optional: false,
            circular: false,
            isReference: false,
            isInstance: false,
            arrayReference: null,
            objectReference: null
          },
          {
            index: 6,
            key: 'axis',
            type: ['string'],
            value: [],
            nullable: false,
            optional: false,
            circular: false,
            isReference: false,
            isInstance: false,
            arrayReference: null,
            objectReference: null
          }
        ],
        length: 7,
        keys: [
          'tagName',
          'attributes',
          'element',
          'eventListeners',
          'parentItem',
          'children',
          'axis'
        ],
        references: [1],
        isArray: false,
        complete: true
      },
      {
        index: 1,
        details: [
          {
            index: 0,
            key: 'style',
            type: ['object'],
            value: [],
            nullable: false,
            optional: false,
            circular: false,
            isReference: false,
            isInstance: false,
            arrayReference: null,
            objectReference: null
          },
          {
            index: 1,
            key: 'className',
            type: ['string'],
            value: [],
            nullable: false,
            optional: false,
            circular: false,
            isReference: false,
            isInstance: false,
            arrayReference: null,
            objectReference: null
          }
        ],
        length: 2,
        keys: ['style', 'className'],
        references: [],
        isArray: false,
        complete: true
      }
    ])
  })

  test('ensure domItem with child items can be mapped', () => {
    expect(helpers.describeObjectMap(domItem)).toEqual([
      {
        index: 0,
        details: [
          {
            index: 0,
            key: 0,
            type: ['object'],
            value: [],
            nullable: false,
            optional: false,
            circular: false,
            isReference: true,
            isInstance: false,
            arrayReference: null,
            objectReference: 1
          }
        ],
        length: 1,
        keys: [0],
        references: [0],
        isArray: true,
        complete: true
      },
      {
        index: 1,
        details: [
          {
            index: 0,
            key: 'attributes',
            type: ['object'],
            value: [],
            nullable: false,
            optional: false,
            circular: false,
            isReference: true,
            isInstance: false,
            arrayReference: null,
            objectReference: 2
          },
          {
            index: 1,
            key: 'axis',
            type: ['string'],
            value: [],
            nullable: false,
            optional: false,
            circular: false,
            isReference: false,
            isInstance: false,
            arrayReference: null,
            objectReference: null
          },
          {
            index: 2,
            key: 'children',
            type: ['object'],
            value: [],
            nullable: false,
            optional: false,
            circular: false,
            isReference: true,
            isInstance: false,
            arrayReference: 0,
            objectReference: null
          },
          {
            index: 3,
            key: 'element',
            type: ['object'],
            value: [],
            nullable: false,
            optional: false,
            circular: false,
            isReference: false,
            isInstance: false,
            arrayReference: null,
            objectReference: null
          },
          {
            index: 4,
            key: 'eventListeners',
            type: ['object'],
            value: [],
            nullable: false,
            optional: false,
            circular: false,
            isReference: false,
            isInstance: false,
            arrayReference: null,
            objectReference: null
          },
          {
            index: 5,
            key: 'parentItem',
            type: ['object'],
            value: [],
            nullable: false,
            optional: false,
            circular: false,
            isReference: false,
            isInstance: false,
            arrayReference: null,
            objectReference: null
          },
          {
            index: 6,
            key: 'tagName',
            type: ['string'],
            value: [],
            nullable: false,
            optional: false,
            circular: false,
            isReference: false,
            isInstance: false,
            arrayReference: null,
            objectReference: null
          },
          {
            index: 7,
            key: 'hasShip',
            type: ['boolean'],
            value: [],
            nullable: false,
            optional: true,
            circular: false,
            isReference: false,
            isInstance: false,
            arrayReference: null,
            objectReference: null
          },
          {
            index: 8,
            key: 'isHit',
            type: ['boolean'],
            value: [],
            nullable: false,
            optional: true,
            circular: false,
            isReference: false,
            isInstance: false,
            arrayReference: null,
            objectReference: null
          },
          {
            index: 9,
            key: 'point',
            type: ['object'],
            value: [],
            nullable: false,
            optional: true,
            circular: false,
            isReference: false,
            isInstance: false,
            arrayReference: null,
            objectReference: null
          }
        ],
        length: 10,
        keys: [
          'attributes',
          'axis',
          'children',
          'element',
          'eventListeners',
          'parentItem',
          'tagName',
          'hasShip',
          'isHit',
          'point'
        ],
        references: [0, 2],
        isArray: false,
        complete: true
      },
      {
        index: 2,
        details: [
          {
            index: 0,
            key: 'className',
            type: ['string'],
            value: [],
            nullable: false,
            optional: true,
            circular: false,
            isReference: false,
            isInstance: false,
            arrayReference: null,
            objectReference: null
          },
          {
            index: 1,
            key: 'style',
            type: ['object'],
            value: [],
            nullable: false,
            optional: false,
            circular: false,
            isReference: false,
            isInstance: false,
            arrayReference: null,
            objectReference: null
          }
        ],
        length: 2,
        keys: ['className', 'style'],
        references: [],
        isArray: false,
        complete: true
      }
    ])
  })

  test('object with nested instance will not declare as reference', () => {
    const instanceObject = { one: 'first', instance: Object.create({ two: 'second' }) }
    expect(helpers.describeObjectMap(instanceObject)).toEqual([{
      index: 0,
      details: [
        {
          index: 0,
          key: 'one',
          type: ['string'],
          value: [],
          nullable: false,
          optional: false,
          circular: false,
          isReference: false,
          isInstance: false,
          arrayReference: null,
          objectReference: null
        },
        {
          index: 1,
          key: 'instance',
          type: ['object'],
          value: [],
          nullable: false,
          optional: false,
          circular: false,
          isReference: false,
          isInstance: true,
          arrayReference: null,
          objectReference: null
        }
      ],
      length: 2,
      keys: ['one', 'instance'],
      references: [],
      isArray: false,
      complete: true
    }])
  })

  test('object checked from middle instead of top of node tree', () => {
    const childNode = nodeTree.children[0]
    expect(helpers.describeObjectMap(childNode)).toEqual([
      {
        index: 0,
        details: [
          {
            index: 0,
            key: 'name',
            type: ['string'],
            value: [],
            nullable: false,
            optional: false,
            circular: false,
            isReference: false,
            isInstance: false,
            arrayReference: null,
            objectReference: null
          },
          {
            index: 1,
            key: 'parent',
            type: ['object'],
            value: [],
            nullable: true,
            optional: false,
            circular: false,
            isReference: true,
            isInstance: false,
            arrayReference: null,
            objectReference: 0
          },
          {
            index: 2,
            key: 'children',
            type: ['object'],
            value: [],
            nullable: false,
            optional: false,
            circular: false,
            isReference: true,
            isInstance: false,
            arrayReference: 1,
            objectReference: null
          }
        ],
        length: 3,
        keys: ['name', 'parent', 'children'],
        references: [1, 2],
        isArray: false,
        complete: true
      },
      {
        index: 1,
        details: [
          {
            index: 0,
            key: 0,
            type: ['object'],
            value: [],
            nullable: false,
            optional: false,
            circular: true,
            isReference: true,
            isInstance: false,
            arrayReference: null,
            objectReference: 0
          }
        ],
        length: 2,
        keys: [0],
        references: [0],
        isArray: true,
        complete: true
      }
    ])
  })

  test('multiple circular reference object will complete from top', () => {
    expect(helpers.describeObjectMap(circularObject)).toEqual([
      {
        index: 0,
        details: [
          {
            index: 0,
            key: 'name',
            type: ['string'],
            value: [],
            nullable: false,
            optional: false,
            circular: false,
            isReference: false,
            isInstance: false,
            arrayReference: null,
            objectReference: null
          },
          {
            index: 1,
            key: 'parent',
            type: ['object'],
            value: [],
            nullable: false,
            optional: false,
            circular: true,
            isReference: true,
            isInstance: false,
            arrayReference: null,
            objectReference: 0
          },
          {
            index: 2,
            key: 'body',
            type: ['object'],
            value: [],
            nullable: false,
            optional: true,
            circular: false,
            isReference: true,
            isInstance: false,
            arrayReference: null,
            objectReference: 0
          },
          {
            index: 3,
            key: 'head',
            type: ['object'],
            value: [],
            nullable: false,
            optional: true,
            circular: false,
            isReference: true,
            isInstance: false,
            arrayReference: null,
            objectReference: 0
          },
          {
            index: 4,
            key: 'children',
            type: ['object'],
            value: [],
            nullable: false,
            optional: false,
            circular: false,
            isReference: true,
            isInstance: false,
            arrayReference: 1,
            objectReference: null
          }
        ],
        length: 5,
        keys: ['name', 'parent', 'body', 'head', 'children'],
        references: [1, 2, 3, 4],
        isArray: false,
        complete: true
      },
      {
        index: 1,
        details: [
          {
            index: 0,
            key: 0,
            type: ['object'],
            value: [],
            nullable: false,
            optional: false,
            circular: false,
            isReference: true,
            isInstance: false,
            arrayReference: null,
            objectReference: 0
          }
        ],
        length: 2,
        keys: [0],
        references: [0],
        isArray: true,
        complete: true
      }
    ])
  })

  test('multiple circular reference object will complete from middle', () => {
    expect(helpers.describeObjectMap(circularObject.body)).toEqual([
      {
        index: 0,
        details: [
          {
            index: 0,
            key: 'name',
            type: ['string'],
            value: [],
            nullable: false,
            optional: false,
            circular: false,
            isReference: false,
            isInstance: false,
            arrayReference: null,
            objectReference: null
          },
          {
            index: 1,
            key: 'parent',
            type: ['object'],
            value: [],
            nullable: false,
            optional: false,
            circular: false,
            isReference: true,
            isInstance: false,
            arrayReference: null,
            objectReference: 0
          },
          {
            index: 2,
            key: 'children',
            type: ['object'],
            value: [],
            nullable: false,
            optional: false,
            circular: false,
            isReference: true,
            isInstance: false,
            arrayReference: 1,
            objectReference: null
          },
          {
            index: 3,
            key: 'body',
            type: ['object'],
            value: [],
            nullable: false,
            optional: true,
            circular: true,
            isReference: true,
            isInstance: false,
            arrayReference: null,
            objectReference: 0
          },
          {
            index: 4,
            key: 'head',
            type: ['object'],
            value: [],
            nullable: false,
            optional: true,
            circular: true,
            isReference: true,
            isInstance: false,
            arrayReference: null,
            objectReference: 0
          }
        ],
        length: 5,
        keys: ['name', 'parent', 'children', 'body', 'head'],
        references: [1, 2, 3, 4],
        isArray: false,
        complete: true
      },
      {
        index: 1,
        details: [
          {
            index: 0,
            key: 0,
            type: ['object'],
            value: [],
            nullable: false,
            optional: false,
            circular: true,
            isReference: true,
            isInstance: false,
            arrayReference: null,
            objectReference: 0
          }
        ],
        length: 2,
        keys: [0],
        references: [0],
        isArray: true,
        complete: true
      }
    ])
  })
})

describe('describeObjectMap; with mapLimit', () => {
  test('will limit a map to one which is the same as a single descriptor within an array', () => {
    const result = helpers.describeObjectMap(multiReferenceObject, { mapLimit: 1 })
    expect(result).toEqual([helpers.describeObject(multiReferenceObject)])
    expect(result.length).toBe(1)
  })

  test('will limit a map to two, capturing the original and one reference object', () => {
    expect(helpers.describeObjectMap(multiReferenceObject, { mapLimit: 2 }).length).toBe(2)
  })

  test('will limit a map to four, capturing three of the references', () => {
    expect(helpers.describeObjectMap(multiReferenceObject, { mapLimit: 4 }).length).toBe(4)
  })

  test('will limit a map by five which is the same as all references', () => {
    const fullyMapped = helpers.describeObjectMap(multiReferenceObject)
    const limitFive = helpers.describeObjectMap(multiReferenceObject, { mapLimit: 5 })
    expect(fullyMapped).toEqual(limitFive)
  })
})

describe('describeObjectMap; with depthLimit', () => {
  test('with depth limit zero will be the same as single descriptor within an array', () => {
    const result = helpers.describeObjectMap(deepReferenceObject, { depthLimit: 0 })
    expect(result).toEqual([helpers.describeObject(deepReferenceObject)])
    expect(result.length).toBe(1)
  })

  test('with depth limit one will only include main descriptor and one nested object', () => {
    expect(helpers.describeObjectMap(deepReferenceObject, { depthLimit: 1 }).length).toBe(3)
  })

  test('with depth limit two will not include the array on depth of four', () => {
    expect(helpers.describeObjectMap(deepReferenceObject, { depthLimit: 2 }).length).toBe(4)
  })

  test('with depth limit three is the max depth of this object so it should result in the same as no limit', () => {
    const result = helpers.describeObjectMap(deepReferenceObject, { depthLimit: 3 })
    expect(result.length).toBe(5)
    expect(result).toEqual(helpers.describeObjectMap(deepReferenceObject))
  })
})

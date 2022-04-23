const { containsField, matchFieldValue, queryMapper, queryResolver } = require('../../src/resolvers/QueryResolver')

describe('QueryResolver test suite', () => {
  const item = { pid: 'm000qzlb', title: 'Max Richter\'s Sleep', master_brand_id: 'bbc_four' }

  describe('containsField', () => {
    it('should return true when field and and contains parameter are correct', () => {
      expect(containsField(item, ['master_brand_id', 'true'])).toBeTruthy()
      expect(containsField(item, ['is_movie', 'false'])).toBeTruthy()
    })

    it('should return false when field and and contains parameter are incorrect', () => {
      expect(containsField(item, ['master_brand_id', 'false'])).toBeFalsy()
      expect(containsField(item, ['is_movie', 'true'])).toBeFalsy()
    })

    it.each(['string', 10, true, undefined])('should return false when (%s) is given as contains argument', (data) => {
      expect(containsField(item, ['master_brand_id', data])).toBeFalsy()
    })
  })

  describe('matchFieldValue', () => {
    it('should return true when field value and argument are equal', () => {
      expect(matchFieldValue(item, ['pid', 'm000qzlb'])).toBeTruthy()
    })

    it('should return false when field value and argument are not eqaul', () => {
      expect(matchFieldValue(item, ['pid', 'm000qzla'])).toBeFalsy()
    })

    it('should return false when given field not in item', () => {
      expect(matchFieldValue(item, ['is_movie', 'anything'])).toBeFalsy()
    })
  })

  describe('queryMapper', () => {
    it('should return function when given a valid queryFunction parameter', () => {
      expect(queryMapper('contains')).toBeInstanceOf(Function)
    })

    it('should return a boilerplate function when given invalid queryFunction parameter', () => {
      expect(queryMapper('garbage')()).toBeFalsy()
    })
  })

  describe('queryResolver', () => {
    const data = require('./stubs/queryResolver.json')

    it('should be able to handle no queries passed in', () => {
      const returnValue = queryResolver(data, [], 3)
      expect(returnValue).toEqual(data.slice(0, 3))
      expect(returnValue.length).toBe(3)
    })

    it('should return an empty array if bad query given', () => {
      const returnValue = queryResolver(data, [{
        queryFunction: 'badQueryName',
        queryArguments: ['master_brand_id', 'true']
      }], 3)
      expect(returnValue.length).toBe(0)
    })

    it('should be able to handle one query passed in', () => {
      const returnValue = queryResolver(data, [{
        queryFunction: 'contains',
        queryArguments: ['master_brand_id', 'true']
      }], 3)
      expect(returnValue).toEqual([data[0], data[1]])
      expect(returnValue.length).toBe(2)
    })

    it('should be able to handle multiple queries passed in', () => {
      const returnValue = queryResolver(data, [
        {
          queryFunction: 'contains',
          queryArguments: ['master_brand_id', 'true']
        },
        {
          queryFunction: 'matchFieldValue',
          queryArguments: ['is_movie', true]
        }
      ], 3)
      expect(returnValue).toEqual([data[1]])
      expect(returnValue.length).toBe(1)
    })
  })
})

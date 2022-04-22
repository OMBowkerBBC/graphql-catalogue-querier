const { containsField } = require('../src/resolvers/QueryResolver')

describe('QueryResolver test suite', () => {
  describe('containsField', () => {
    it('should return true when field and and contains parameter are correct', () => {
      const item = { pid: 'm000qzlb', title: 'Max Richter\'s Sleep', master_brand_id: 'bbc_four' }
      expect(containsField(item, ['master_brand_id', 'true'])).toBeTruthy()
      expect(containsField(item, ['is_movie', 'false'])).toBeTruthy()
    })

    it('should return false when field and and contains parameter are incorrect', () => {
      const item = { pid: 'm000qzlb', title: 'Max Richter\'s Sleep', master_brand_id: 'bbc_four' }
      expect(containsField(item, ['master_brand_id', 'false'])).toBeFalsy()
      expect(containsField(item, ['is_movie', 'true'])).toBeFalsy()
    })

    it('should return false when junk is given in as contains argument', () => {
      const item = { pid: 'm000qzlb', title: 'Max Richter\'s Sleep', master_brand_id: 'bbc_four' }
      expect(containsField(item, ['master_brand_id', 'adasdsad'])).toBeFalsy()
      expect(containsField(item, ['master_brand_id', 10])).toBeFalsy()
      expect(containsField(item, ['master_brand_id', true])).toBeFalsy()
      expect(containsField(item, ['master_brand_id', undefined])).toBeFalsy()
    })
  })
})

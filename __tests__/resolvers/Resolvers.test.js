const { resolvers } = require('../../src/resolvers/Resolvers')
jest.mock('../../src/resolvers/QueryResolver')
const QueryResolver = require('../../src/resolvers/QueryResolver')

describe('Resolvers test suite', () => {
  describe('resolvers', () => {
    const errorObject = { error: 'An error has occurred.' }
    const stubData = require('./stubs/catalogueItem.json')

    describe('CatalogueItem', () => {
      it.each(['Episode', 'Series', 'Brand'])('should return correct object type for %s', (type) => {
        expect(resolvers.CatalogueItem.__resolveType(stubData[type.toLowerCase()])).toEqual(type)
      })
    })

    describe('EpisodeResult', () => {
      it('should return an error object when an error has occurred', () => {
        expect(resolvers.EpisodeResult.__resolveType(errorObject)).toEqual('EpisodeError')
      })

      it('should return Episode object type when error field is not present', () => {
        expect(resolvers.EpisodeResult.__resolveType({})).toEqual('Episode')
      })
    })

    describe('QueryResult', () => {
      it('should return an error when an error object has occured', () => {
        expect(resolvers.QueryResult.__resolveType(errorObject)).toEqual('CatalogueTypeError')
      })

      it.each(['Episode', 'Series', 'Brand'])('should return correct object type for %s', (type) => {
        expect(resolvers.CatalogueItem.__resolveType(stubData[type.toLowerCase()])).toEqual(type)
      })
    })
  })

  describe('Query', () => {
    const bargainHuntPid = 'm0010zwd'
    const moviePid = 'm000lwkp'
    const brandPid = 'p0b5vt7f'

    describe('getNumberOfEpisodes', () => {
      it('should return correct number of episode', () => {
        expect(resolvers.Query.getNumberOfEpisodes('_', { amount: 2 }).length).toBe(2)
      })

      it('should not return the same episode twice', () => {
        const firstResult = resolvers.Query.getNumberOfEpisodes('_', { amount: 1 })
        const secondResult = resolvers.Query.getNumberOfEpisodes('_', { amount: 1 })
        expect(firstResult).not.toEqual(secondResult)
      })

      it.each(['string', -1, true, undefined])('should return empty list for input %s', (data) => {
        expect(resolvers.Query.getNumberOfEpisodes('_', { amount: data }).length).toBe(0)
      })
    })

    describe('getEpisodeTreeForPid ', () => {
      const extraeTreeTypes = ['series', 'brand']

      it('should return full tree when given a valid pid', () => {
        const result = resolvers.Query.getEpisodeTreeForPid('_', { pid: bargainHuntPid })
        expect(result.pid).toEqual(bargainHuntPid)
        extraeTreeTypes.forEach(type => expect(result[type]).toBeInstanceOf(Object))
      })

      it('should return brand and series field as null if not present', () => {
        const result = resolvers.Query.getEpisodeTreeForPid('_', { pid: moviePid })
        expect(result.pid).toEqual(moviePid)
        extraeTreeTypes.forEach(type => expect(result[type]).toBeUndefined())
      })

      it('should return an error with correct error message when a pid is not an episode', () => {
        const result = resolvers.Query.getEpisodeTreeForPid('_', { pid: brandPid })
        expect(Object.keys(result)).toContain('error')
        expect(result.error).toEqual(`Could not find an episode with pid ${brandPid}`)
      })
    })

    describe('getEpisodeSiblings', () => {
      it('should return a single episode if no parent is found', () => {
        const result = resolvers.Query.getEpisodeSiblings('_', { pid: moviePid })
        expect(result.length).toBe(1)
        expect(Object.keys(result[0])).not.toContain('error')
      })

      it('should return a list of episode when episode pid has a parent', () => {
        const result = resolvers.Query.getEpisodeSiblings('_', { pid: bargainHuntPid })
        expect(result.length).toBeGreaterThan(1)
      })

      it('should return an error if an invalid pid is given', () => {
        const result = resolvers.Query.getEpisodeSiblings('_', { pid: brandPid })
        expect(result.length).toBe(1)
        expect(result[0].error).toEqual(`Could not find an episode with pid ${brandPid}`)
      })
    })

    describe('filterEpisodesQuery', () => {
      it('should return an empty array when not given a valid type', () => {
        const badType = 'invalid'
        const result = resolvers.Query.filterEpisodesQuery('_', { queries: [], type: badType })
        expect(result[0].error).toEqual(`Type '${badType}' is not valid`)
      })

      it.each(['episode', 'series', 'brand'])('should allow calling of queryResolver', (type) => {
        resolvers.Query.filterEpisodesQuery('_', { queries: [], type, amount: 1 })
        expect(QueryResolver.queryResolver).toHaveBeenCalled()
      })
    })
  })
})

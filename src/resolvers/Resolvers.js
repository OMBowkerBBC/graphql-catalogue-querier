const catalogue = process.env.ENVIRONMENT === 'DEV'
  ? require('../../data/v2FullCat.json')
  : require('../../__tests__/resolvers/stubs/miniCatalogue.json')
const { queryResolver } = require('./QueryResolver')

const pidErrorObject = (pid) => ({ error: `Could not find an episode with pid ${pid}` })
const typeErrorObject = (type) => ([{ error: `Type '${type}' is not valid` }])

const resolvers = {
  CatalogueItem: {
    __resolveType: obj => {
      if (obj.type === 'episode') return 'Episode'
      else if (obj.type === 'series') return 'Series'
      else if (obj.type === 'brand') return 'Brand'
    }
  },

  EpisodeResult: {
    __resolveType: obj => {
      if (obj.error) return 'EpisodeError'
      else return 'Episode'
    }
  },

  QueryResult: {
    __resolveType: obj => {
      if (obj.error) return 'CatalogueTypeError'
      else if (obj.type === 'episode') return 'Episode'
      else if (obj.type === 'series') return 'Series'
      else if (obj.type === 'brand') return 'Brand'
    }
  },

  Query: {
    getAll (parent, { type }) { return catalogue[type] },

    getNumberOfEpisodes (parent, { amount }) {
      if (typeof (amount) !== 'number') return []
      if (amount > catalogue.episode.length) return catalogue.episode

      const returnValue = []
      const usedValues = []
      for (let i = 0; i < amount; i++) {
        let index = -1
        while (usedValues.includes(index) || index === -1) {
          index = Math.floor(Math.random() * catalogue.episode.length)
        }
        usedValues.push(index)
        returnValue.push(catalogue.episode[index])
      }
      return returnValue
    },
    getEpisodeTreeForPid (parent, { pid }) {
      const episode = catalogue.episode.find(item => item.pid === pid)
      const series = catalogue.series.find(item => item.pid === episode?.member_of?.pid)
      const brand = catalogue.brand.find(item => item.pid === series?.member_of?.pid)
      return episode
        ? {
            ...episode,
            ...(series && { series: { ...series } }),
            ...(brand && { brand: { ...brand } })
          }
        : pidErrorObject(pid)
    },
    getEpisodeSiblings (parent, { pid }) {
      const episode = catalogue.episode.find(item => item.pid === pid)
      if (!episode) return [pidErrorObject(pid)]

      const parentPid = episode?.member_of?.pid
      return parentPid ? catalogue.episode.filter(item => item?.member_of?.pid === parentPid) : [episode]
    },
    filterEpisodesQuery (parent, { queries, type, amount = 1000000 }) {
      if (!['episode', 'series', 'brand'].includes(type)) return typeErrorObject(type)

      switch (type) {
        case 'episode':
          return queryResolver(catalogue.episode, queries, amount)
        case 'series':
          return queryResolver(catalogue.series, queries, amount)
        case 'brand':
          return queryResolver(catalogue.brand, queries, amount)
      }
    }
  }
}

module.exports = { resolvers }

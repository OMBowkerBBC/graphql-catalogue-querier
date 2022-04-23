const catalogue = require('../../data/v2Cat.json')
const { queryResolver } = require('./QueryResolver')

const pidErrorObject = (pid) => ({ error: `Could not find an episode with pid ${pid}` })

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

  Query: {
    getAll (parent, { type }) { return catalogue[type] },

    getNumberOfEpisodes (parent, { amount }) {
      if (typeof (amount) !== 'number') return []

      const returnValue = []
      for (let i = 0; i < amount; i++) {
        const index = Math.floor(Math.random() * catalogue.episode.length)
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
      if (!['episode', 'series', 'brand'].includes(type)) {
        console.log(`Invalid type : ${type}\nMust be either episode, series or brand.`)
        return []
      }

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

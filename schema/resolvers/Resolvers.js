const catalogue = require("../../data/v2Cat.json");
const { queryResolver } = require('./QueryResolver');

const resolvers = {
    Query: {
        getAllEpisodes() { return catalogue.episode; },
        getAllSeries() { return catalogue.series; },
        getAllBrands() { return catalogue.brand; },

        getNumberOfEpisodes(parent, { amount }) {
            const returnValue = [];
            for (let i = 0; i < amount; i++) {
                const index = Math.floor(Math.random() * catalogue.episode.length);
                returnValue.push(catalogue.episode[index]);
            }
            return returnValue;
        },
        getEpisodeTreeForPid(parent, { pid }) {
            const episode = catalogue.episode.find(item => item.pid === pid);
            const series  = catalogue.series.find(item => item.pid === episode?.member_of?.pid);
            const brand = catalogue.brand.find(item => item.pid === series?.member_of?.pid);
            return returnValue = {
                ...episode,
                ...( series && { series: { ...series } } ),
                ...( brand  && { brand: { ...brand } } ),
            };
        },
        getEpisodeSiblings(parent, { pid }) {
            const episode = catalogue.episode.find(item => item.pid === pid);
            const parentPid = episode?.member_of?.pid;
            return parentPid ? catalogue.episode.filter(item => item?.member_of?.pid === parentPid) : [episode];
        },
        filterEpisodesQuery(parent, { queries, type, amount = 1000000 }) {
            if (!['episode', 'series', 'brand'].includes(type)) {
                console.log(`Invalid type : ${type}\nMust be either episode, series or brand.`);
                return [];
            }

            switch (type) {
                case "episode":
                    return queryResolver(catalogue.episode, queries, amount);
                case "series":
                    return queryResolver(catalogue.series, queries, amount);
                case "brand":
                    return queryResolver(catalogue.brand, queries, amount);
            }
        }
    },
}

module.exports = { resolvers };

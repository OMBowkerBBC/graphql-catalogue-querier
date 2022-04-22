const { gql } = require('apollo-server-express')

const typeDefs = gql`
    type Synopses {
        short: String
        medium: String
        long: String
    }

    type InvocationMechanisms {
        platform: String
        uri_template: String
    }

    type Interactions {
        type: String!
        invocation_mechanisms: [InvocationMechanisms]
    }

    type OnDemands {
        platform: String!
        start: String!
        end: String!
    }

    type Subtitles {
        supplemental: Boolean!
        lang: String!
        type: String!
    }

    type AudioVisualAttributes {
        aspect_ratio: String
        sound_format: String
        colour: String
        highest_source_quality: String
    }

    type AvailableVersions {
        type: String!
        version_types: [String]!
        pid: String!
        seq: Int!
        duration: String!
        ondemands: [OnDemands]
        subtitles: Subtitles
        audio_visual_attributes: AudioVisualAttributes
    }

    type Formats {
        format_id: String!
    }

    type GenreGroups {
        genre_id: String!
    }

    type MemberOf {
        pid: String
        type: String
        relative_ordering: String
        index: String
    }

    type Image {
        url: String!
        unattributed_url: String!
        width: Int!
        height: Int!
        aspect_ratio: String!
        programme_logo: Boolean!
    }

    type Brand {
        type: String!
        pid: String!
        seq: Int!
        title: String!
        synopses: Synopses!
        bbc_original: Boolean!
        interactions: [Interactions]
        formats: [Formats]
        genre_groups: [GenreGroups]
        recent_first: Boolean
        master_brand_id: String
        images: [Image]!
    }

    type Series {
        type: String!
        pid: String!
        seq: Int!
        title: String!
        synopses: Synopses!
        bbc_original: Boolean!
        interactions: [Interactions]
        formats: [Formats]
        genre_groups: [GenreGroups]
        images: [Image]!
        member_of: MemberOf
    }

    type Episode {
        type: String!
        pid: String!
        seq: Int!
        title: String!
        synopses: Synopses!
        bbc_original: Boolean!
        interactions: [Interactions]
        guidance: Boolean
        is_movie: Boolean
        available_versions: [AvailableVersions]!
        master_brand_id: String
        release_date: String!
        languages: [String]
        formats: [Formats]
        genre_groups: [GenreGroups]
        member_of: MemberOf
        territories: [String]
        images: [Image]!
        series: Series
        brand: Brand
    }

    input QueryParameter {
        queryFunction: String!
        queryArguments: [String]
    }

    type Query {
        getAllEpisodes: [Episode]
        getNumberOfEpisodes(amount: Int!): [Episode]
        getEpisodeTreeForPid(pid: String!): Episode
        getEpisodeSiblings(pid: String!): [Episode]

        filterEpisodesQuery(queries: [QueryParameter]!, type: String!, amount: Int): [Episode]

        getAllSeries: [Series]
        getAllBrands: [Brand]
    }
`

module.exports = { typeDefs }

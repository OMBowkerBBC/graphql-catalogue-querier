const { gql } = require('apollo-server-express')

const typeDefs = gql`

    "Object containing synopses information."
    type Synopses {
        "Synopses short." short: String
        "Synopses medium." medium: String
        "Synopses long." long: String
    }

    "Conatins URL templates for different platforms"
    type InvocationMechanisms {
        "Platform" platform: String
        "URL template." uri_template: String
    }

    "Contains differnet InvocationMechanisms and their type."
    type Interactions {
        "Type of interaction."  type: String!
        "List of InvocationMechanisms." invocation_mechanisms: [InvocationMechanisms]
    }

    "On demand data."
    type OnDemands {
        "On demand platform." platform: String!
        "Start date" start: String!
        "End date." end: String!
    }

    "Subtitle information."
    type Subtitles {
        "If they are supplemental." supplemental: Boolean!
        "Subtitle language." lang: String!
        "Type of subtilte e.g. closed." type: String!
    }

    "Audio and visual attributes information."
    type AudioVisualAttributes {
        "Aspect ratio." aspect_ratio: String
        "Sound format." sound_format: String
        "Colour" colour: String
        "Highest source quality." highest_source_quality: String
    }

    "Version information."
    type AvailableVersions {
        "Type of object should be version." type: String!
        "List of version types." version_types: [String]!
        "Pid for version." pid: String!
        "Sequence number for version." seq: Int!
        "Duration of version." duration: String!
        "List of on demands for version." ondemands: [OnDemands]
        "Subtitles object for version." subtitles: Subtitles
        "Audio and visual attributes for version." audio_visual_attributes: AudioVisualAttributes
    }

    "List of objects with format IDs."
    type Formats {
        "Format ID." format_id: String!
    }

    "List of objects with genre IDs."
    type GenreGroups {
        "Genre ID." genre_id: String!
    }

    "Details about parent object."
    type MemberOf {
        "Pid of parent object." pid: String
        "Type of parent object e.g. series/brand." type: String
        "Ordering of parent." relative_ordering: String
        "Index of parent." index: String
    }

    "Details about an indiviudal image."
    type Image {
        "Link to image URL" url: String!
        "Link to unattributed image URL." unattributed_url: String!
        "Width of image." width: Int!
        "Height of image." height: Int!
        "Aspect ratio of image." aspect_ratio: String!
        "If it has a programme logo." programme_logo: Boolean!
    }

    "Brand catalogue object."
    type Brand {
        "Type of object should be brand." type: String!
        "Pid of object." pid: String!
        "Sequence number." seq: Int!
        "Title of brand." title: String!
        "Synopses object for brand." synopses: Synopses!
        "If the object is a BBC original." bbc_original: Boolean!
        "List of interactions." interactions: [Interactions]
        "List of formats." formats: [Formats]
        "List of genre groups." genre_groups: [GenreGroups]
        "If this is the latest." recent_first: Boolean
        "ID of master brand e.g. BBC One" master_brand_id: String
        "List of images." images: [Image]!
    }

    "Series catalogue object."
    type Series {
        "Type of object should be series." type: String!
        "Pid of object." pid: String!
        "Sequence number." seq: Int!
        "Title of series." title: String!
        "Synopses object for series." synopses: Synopses!
        "If the object is a BBC original." bbc_original: Boolean!
        "List of interactions." interactions: [Interactions]
        "List of formats." formats: [Formats]
        "List of genre groups." genre_groups: [GenreGroups]
        "List of images." images: [Image]!
        "Object parent information." member_of: MemberOf
    }

    "Episode catalogue object."
    type Episode {
        "Type of object should be episode." type: String!
        "Pid of object." pid: String!
        "Sequence number." seq: Int!
        "Title of epsiode." title: String!
        "Synopses object for episode." synopses: Synopses!
        "If the object is a BBC original." bbc_original: Boolean!
        "List of interactions." interactions: [Interactions]
        "If the episode has parental guidance." guidance: Boolean
        "If the episode is a movie." is_movie: Boolean
        "List of available version for episode." available_versions: [AvailableVersions]!
        "ID of master brand e.g. BBC One" master_brand_id: String
        "Date of release." release_date: String!
        "List of languages." languages: [String]
        "List of formats." formats: [Formats]
        "List of genre groups." genre_groups: [GenreGroups]
        "Object parent information." member_of: MemberOf
        "List of available territories." territories: [String]
        "List of images." images: [Image]!
        "Series associated with episode." series: Series
        "Brand associated with episode." brand: Brand
    }

    "Error for bad epsiode pid."
    type EpisodeError {
        "Error text." error: String!
    }

    "Error for bad catalogue object error."
    type CatalogueTypeError {
        "Error text." error: String!
    }

    "Union for all catalogue items."
    union CatalogueItem = Episode | Series | Brand
    "Union to return either an Episode or an Error."
    union EpisodeResult = Episode | EpisodeError
    "Union to return either a CatalogueItem or an Error."
    union QueryResult = Episode | Series | Brand | CatalogueTypeError

    "Input required to carry out queries."
    input QueryParameter {
        "Query name." queryFunction: String!
        "Query arguments." queryArguments: [String]
    }

    "Queries for GraphQL endpoint."
    type Query {
        "Query to get all of a specified catalogue item type."
        getAll(
            "Type of catalogue item e.g. episode, series, brand." type: String! 
        ): [CatalogueItem]

        "Query to get a random number of episodes."
        getNumberOfEpisodes(
            "Number of episodes wanted." amount: Int!
        ): [Episode]

        "Query to get brand and series tree for an epsiode."
        getEpisodeTreeForPid(
            "Episode pid." pid: String!
        ): EpisodeResult

        "Query to get all sibling of a given pid."
        getEpisodeSiblings(
            "Episode or Series pid." pid: String!
        ): [EpisodeResult]

        "Query to run custom filtering querys."
        filterEpisodesQuery(
            "List of queries to run."  queries: [QueryParameter]!,
            "Type of catalogue item e.g. episode, series, brand." type: String!,
            "Max amount of items to return." amount: Int
        ): [QueryResult]
    }
`

module.exports = { typeDefs }

# graphql-catalogue-querier

###### Note this project is very early in development so a lot of this could change.

### Overview
This is a graphql based application that will allow users to query the catalogue for very specific scenarios and situations.
May also be useful when creating specific stub data for tests.

I may eventually add a user friendly front end to the application so non-technical users can also use the tool.

#### Potential Scenarios
The application currently has some very basic queries, but I am starting to develop more detailed ones.

##### Basic Queries

| Name   |      Description      |  Arguments |
|--------|:---------------------:|-----------:|
| getAllEpisodes | Get all episodes. | None |
| getAllSeries | Get all series. | None |
| getAllBrands | Get all brands. | None |
| getNumberOfEpisodes | Get a specified number of random episodes. | amount(Number) |
| getEpisodeTreeForPid | Get an episode, series and brand related to a PID. | pid(String) |
| getEpisodeSiblings | Get an episodes sibling episodes. | pid(String) |
  
##### Detailed Queries
filterEpisodesQuery is used to query the data. This is where most development will be done and the table below shows
what functions can be ran using this feature, along with an image to show what a query would look like in the editor.

| Name   |      Description      |  Arguments |
|----------|:-------------:|------:|
| contains | Checks a specified field in each item and checks if it exists. | field, contains |
| matchFieldValue | Checks if a field is equal to a specified value | field, value |

### Testing

### Running
`npm start`

### Deploying

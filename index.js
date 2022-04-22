const { ApolloServer } = require('apollo-server-express');
const { typeDefs } = require('./schema/typedefs/TypeDefs');
const { resolvers } = require('./schema/resolvers/Resolvers');
const  express = require('express');

const app = express();
const server = new ApolloServer({ typeDefs, resolvers });

server.start().then(res => {
    server.applyMiddleware({ app });
    app.listen({ port: 3001 }, () => console.log('App listening on port 3001.'));
});

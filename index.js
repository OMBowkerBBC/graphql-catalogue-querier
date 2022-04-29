const { ApolloServer } = require('apollo-server-express')
const { typeDefs } = require('./src/typedefs/TypeDefs')
const { resolvers } = require('./src/resolvers/Resolvers')
const express = require('express')

const app = express()
app.get('/health', (req, res) => {
  res.send('')
})

const server = new ApolloServer({ typeDefs, resolvers })

server.start().then(res => {
  server.applyMiddleware({ app })
  app.listen({ port: 3001 }, () => console.log('App listening on port 3001.'))
})

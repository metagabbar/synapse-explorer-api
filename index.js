import 'dotenv/config'
import {ApolloServer} from "apollo-server"
import {ApolloServerPluginLandingPageGraphQLPlayground} from "apollo-server-core"

import {schema} from "./api/gql/schema.js"
import "./api/db/index.js"
import {bridgeTransactions} from "./api/controllers/bridgeTransactions.js"
import {latestBridgeTransactions} from "./api/controllers/latestBridgeTransactions.js"
import {bridgeTransactionsCount} from "./api/controllers/bridgeTransactionsCount.js"
import {countByChainId} from './api/controllers/countByChainId.js'

const server = new ApolloServer({
    typeDefs: schema,
    resolvers: {
        Query: {
            bridgeTransactions,
            latestBridgeTransactions,
            bridgeTransactionsCount,
            countByChainId,
        },
    },
    plugins: [
        ApolloServerPluginLandingPageGraphQLPlayground({}),
    ]
})

server.listen().then(({ url }) => {
    console.log('Running a GraphQL API server at localhost:4000/graphql')
});
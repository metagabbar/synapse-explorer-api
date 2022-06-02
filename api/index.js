import 'dotenv/config'
import {ApolloServer} from "apollo-server"
import {ApolloServerPluginLandingPageGraphQLPlayground} from "apollo-server-core"

import {schema} from "./gql/schema.js"
import "./db/index.js"
import {bridgeTransactions} from "./controllers/bridgeTransactions.js"
import {latestBridgeTransactions} from "./controllers/latestBridgeTransactions.js"
import {bridgeTransactionsCount} from "./controllers/bridgeTransactionsCount.js"
import {bridgeTransactionsMedianValue} from "./controllers/bridgeTransactionsMedianValue.js"
import {bridgeTransactionsMeanValue} from "./controllers/bridgeTransactionsMeanValue.js"
import {bridgeTransactionsTotalValue} from "./controllers/bridgeTransactionsTotalValue.js"
import {countByChainId} from './controllers/countByChainId.js'
import {countByTokenAddress} from './controllers/countByTokenAddress.js'
import {addressRanking} from './controllers/addressRanking.js'

const server = new ApolloServer({
    typeDefs: schema,
    resolvers: {
        Query: {
            bridgeTransactions,
            latestBridgeTransactions,
            bridgeTransactionsCount,
            bridgeTransactionsMedianValue,
            bridgeTransactionsMeanValue,
            bridgeTransactionsTotalValue,
            countByChainId,
            countByTokenAddress,
            addressRanking,
        },
    },
    plugins: [
        ApolloServerPluginLandingPageGraphQLPlayground({}),
    ]
})

server.listen().then(({ url }) => {
    console.log('Running a GraphQL API server at localhost:4000/graphql')
})
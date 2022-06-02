import 'dotenv/config'
import {ApolloServer} from "apollo-server"
import {ApolloServerPluginLandingPageGraphQLPlayground} from "apollo-server-core"

import {schema} from "./api/gql/schema.js"
import "./api/db/index.js"
import {bridgeTransactions} from "./api/controllers/bridgeTransactions.js"
import {latestBridgeTransactions} from "./api/controllers/latestBridgeTransactions.js"
import {countBridgeTransactions} from "./api/controllers/countBridgeTransactions.js"
import {medianBridgeAmount} from "./api/controllers/medianBridgeAmount.js"
import {meanBridgeAmount} from "./api/controllers/meanBridgeAmount.js"
import {totalBridgeAmount} from "./api/controllers/totalBridgeAmount.js"
import {countByChainId} from './api/controllers/countByChainId.js'
import {countByTokenAddress} from './api/controllers/countByTokenAddress.js'
import {addressRanking} from './api/controllers/addressRanking.js'

const server = new ApolloServer({
    typeDefs: schema,
    resolvers: {
        Query: {
            bridgeTransactions,
            latestBridgeTransactions,
            countBridgeTransactions,
            medianBridgeAmount,
            meanBridgeAmount,
            totalBridgeAmount,
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
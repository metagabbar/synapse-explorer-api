import 'dotenv/config'
import { ApolloServer } from 'apollo-server'
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'

import { schema } from './api/gql/schema.js'
import './api/db/index.js'

import { bridgeTransactions } from './api/controllers/bridgeTransactions.js'
import { latestBridgeTransactions } from './api/controllers/latestBridgeTransactions.js'
import { bridgeAmountStatistic } from './api/controllers/bridgeAmountStatistic.js'
import { countByChainId } from './api/controllers/countByChainId.js'
import { countByTokenAddress } from './api/controllers/countByTokenAddress.js'
import { addressRanking } from './api/controllers/addressRanking.js'
import { getCsv } from './api/controllers/getCsv.js'
import { historicalStatistics } from './api/controllers/historicalStatistics.js'

// This function will create a new server Apollo Server instance
export const createServer = async (options = { port: 4000 }) => {
  const server = new ApolloServer({
    typeDefs: schema,
    resolvers: {
      Query: {
        bridgeTransactions,
        latestBridgeTransactions,
        bridgeAmountStatistic,
        countByChainId,
        countByTokenAddress,
        addressRanking,
        getCsv,
        historicalStatistics,
      },
    },
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground({})],
  })

  const serverInfo = await server.listen(options)
  console.log(
    `Running a GraphQL API server at localhost:${options.port}/graphql`
  )

  // serverInfo is an object containing the server instance and the url the server is listening on
  return serverInfo
}

await createServer()

import 'dotenv/config'
import express from "express"
import cors from "cors"
import { createServer } from '@graphql-yoga/node'

import {schema} from "./api/gql/schema.js"
import "./api/db/index.js"
import {bridgeTransactions} from "./api/controllers/bridgeTransactions.js"
import {latestBridgeTransactions} from "./api/controllers/latestBridgeTransactions.js"
import {bridgeTransactionsCount} from "./api/controllers/bridgeTransactionsCount.js"

let app = express()

const yoga = createServer({
    schema: {
        typeDefs: schema,
        resolvers: {
            Query: {
                bridgeTransactions,
                latestBridgeTransactions,
                bridgeTransactionsCount
            },
        },
    },
   graphiql: true,
})

app.use('/graphql', cors(), yoga);
app.listen(4000)
console.log('Running a GraphQL API server at localhost:4000/graphql')


//    context: (req) => ({ // Context factory gets called for every request
//       myToken: req.headers.get('authorization'),
//    }),
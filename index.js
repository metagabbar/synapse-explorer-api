import {config} from "dotenv";
config()
import express from "express"
import cors from "cors"
import {graphqlHTTP} from "express-graphql";
import {schema} from "./api/gql/schema.js";
import "./api/db//index.js"
import {getBridgeTransactions} from "./api/controllers/getBridgeTransactions.js";
import {latestBridgeTransactions} from "./api/controllers/latestBridgeTransactions.js";


let app = express();

app.use('/graphql', cors(), graphqlHTTP({
    schema: schema,
    rootValue: {
        getBridgeTransactions: getBridgeTransactions,
        latestBridgeTransactions: latestBridgeTransactions,
    },
    graphiql: true,

}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');

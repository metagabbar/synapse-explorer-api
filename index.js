import express from "express"
import cors from "cors"
import {graphqlHTTP} from "express-graphql";
import {getBridgeTransactions} from "./api/controllers.js";
import {schema} from "./api/schema.js";
import {config} from "dotenv";
config()

let app = express();

app.use('/graphql', cors(), graphqlHTTP({
    schema: schema,
    rootValue: {
        getBridgeTransactions: getBridgeTransactions
    },
    graphiql: true,

}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');

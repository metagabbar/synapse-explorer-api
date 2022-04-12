import express from "express"
import {graphqlHTTP} from "express-graphql";
import {getTransactions} from "./api/controller.js";
import {schema} from "./api/schema.js";
import {config} from "dotenv";
config()

let app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: {
        getTransactions: getTransactions
    },
    graphiql: true,

}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');

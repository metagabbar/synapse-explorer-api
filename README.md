# synapse-explorer-api

GraphQL API to query synapse bridge transactions.

This service is simply an API that pulls in data from the database populated by the indexer service.

A sample query for the API is shown below. Refer to GraphQL docs on the API endpoint for a complete API and type details.

```graphql
query {
  getBridgeTransactions(
    address: "0xa89284b83afb5974f4798dc92ca4e987ed855f73d56a859dfc5a7e99d64a5eff"
  ) {
    receivedValue
    txnFromHash
    txnToHash
  }
}
```

### Local setup

- `npm install`
- Add MONGO_URI and REDIS_URI in the `.env` file
- `npm start`

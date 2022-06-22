# synapse-explorer-api

GraphQL API to query synapse bridge transactions.

This service is simply an API that pulls in data from the database populated by the indexer service.

A sample query for the API is shown below. Refer to GraphQL docs on the API endpoint for a complete API and type details.

```graphql
query {
  bridgeTransactions(
    address: "0xa89284b83afb5974f4798dc92ca4e987ed855f73d56a859dfc5a7e99d64a5eff"
  ) {
      kappa
  }
}
```

### Hot-Code Reloading in Local dev
`npm install -g nodemon`

### Local setup

- `npm install`
- Add MONGO_URI and REDIS_URI in the `.env` file
  - If you are a contributor, reach out to the owner of these repos for Mongo and Redis URIs for testing. If not, the easiest way is to run these locally using docker
    - `docker run -p 27017:27017 mongo`
    - `docker run -p 6379:6379 redis`
- `npm start`

### Workers

The `/workers` run in a separate process in the background, caching results from the database
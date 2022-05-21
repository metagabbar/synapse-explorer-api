import { MongoConnection } from './MongoConnection.js'


await MongoConnection.createClient()


// let client = await MongoConnection.getClientDb()
let MONGO_DB = {}
let BRIDGE_TRANSACTIONS_COLLECTION = {}

/**
 * Function to get the underlying mongo collection ptr to do
 * queries on from db & collection name
 * @param db - the underlying mongodb ptr
 * @param collectionName - the name of the mongodb collection
 */
async function getCollection(db, collectionName) {
  let res = db.collection(collectionName)
  return res
}


MongoConnection.getClientDb().then( res => {
  MONGO_DB = res
  BRIDGE_TRANSACTIONS_COLLECTION = getCollection(MONGO_DB, 'bridgetransactions')
  getCollection(MONGO_DB, 'bridgetransactions').then(collection => {
    BRIDGE_TRANSACTIONS_COLLECTION = collection
  })
})






export { MONGO_DB, BRIDGE_TRANSACTIONS_COLLECTION }


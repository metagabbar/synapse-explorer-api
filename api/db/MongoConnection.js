import { MongoClient } from "mongodb"

export class MongoConnection {
  _client

  /** Instantiation/creation of mongodb client */
  static async createClient() {
    let MONGO_URI = process.env.MONGO_URI
    if (process.env.NODE_ENV === "test") {
      MONGO_URI = process.env.TEST_MONGO_URI
      MONGO_URI = MONGO_URI.replace(/['"]+/g, '')
    }

    return MongoConnection._client = await MongoClient.connect(
        MONGO_URI
    )
  }
  /** get the underlying mongo client db */
  static async getClientDb() {
    return MongoConnection._client.db()
  }
}



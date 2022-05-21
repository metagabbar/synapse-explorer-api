import { MongoClient } from "mongodb"

export class MongoConnection {
  _client;

  /** Instantiation/creation of mongodb client */
  static async createClient() {
    return MongoConnection._client = await MongoClient.connect(
      process.env.MONGO_URI
    )
  }
  /** get the underlying mongo client db */
  static async getClientDb() {
    return MongoConnection._client.db();
  }
}



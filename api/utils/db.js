import { MongoClient } from "mongodb";

export class MongoConnection {
    _client;

    static async createClient() {
        return MongoConnection._client = await MongoClient.connect(
            process.env.MONGO_URI
        )
    }
    static async getClientDb() {
        return MongoConnection._client.db();
    }
}

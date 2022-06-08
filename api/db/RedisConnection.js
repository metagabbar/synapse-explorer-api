import Redis from "ioredis"
import hash from "object-hash"

export class RedisConnection {
    _client

    /** Instantiation/creation of mongodb client */
    static async createClient() {
        let REDIS_URI = process.env.REDIS_URI
        REDIS_URI = REDIS_URI.replace(/['"]+/g, '')

        return RedisConnection._client = new Redis(REDIS_URI)
    }
    /** get the underlying mongo client db */
    static async getClient() {
        return RedisConnection._client
    }

    /**
     * Cache mongo results for given graphql query with `queryName` and `args` in redis
     * @param {Object} queryName
     * @param {Object} args
     * @param {String} mongoResults
     * @param {Number} expireIn
     * @return {Promise<String>}
     */
    static async setForQuery(queryName, args, mongoResults, expireIn) {
        let argsHash = hash(args)
        let key = `${queryName}_${argsHash}`
        let jsonRes = JSON.stringify(mongoResults)
        await RedisConnection._client.set(key, jsonRes, 'EX', expireIn)
    }

    /**
     * Get mongo results for given graphql query with `queryName` and `args` in redis
     * @param {Object} queryName
     * @param {Object} args
     * @return {Promise<String>}
     */
    static async getForQuery(queryName, args) {
        let argsHash = hash(args)
        let key = `${queryName}_${argsHash}`
        return RedisConnection._client.get(key)
    }
}

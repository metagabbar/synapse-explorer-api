import {RedisConnection} from "./RedisConnection.js";

/**
 * Use this function as a wrapper for any mongo query we wish to cache
 *
 * If result is found in Redis, it is parsed and sent back. If not, Mongo
 * is queried, results are cached and then sent back
 *
 * The dbCallback argument takes in a function that returns the results
 * of a mongo query for this set of queryName + args
 *
 * @param queryName
 * @param args
 * @param dbCallback
 * @param {Number} expireInSeconds Number of seconds to cache
 * @return {Promise<Object[]>}
 */
export async function queryAndCache(queryName, args, dbCallback, expireInSeconds=30) {
    let res
    let cachedRes = await RedisConnection.getForQuery(
        queryName,
        args
    )

    if (!cachedRes) {
        // Get response from DB and cache it
        res = await dbCallback(args)
        await RedisConnection.setForQuery(
            queryName,
            args,
            res,
            expireInSeconds
        )
    } else {
        // Parse cached response from Redis
        res = JSON.parse(cachedRes)
    }

    return res;
}
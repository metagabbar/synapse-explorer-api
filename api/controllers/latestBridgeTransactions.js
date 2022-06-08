import { BRIDGE_TRANSACTIONS_COLLECTION, DB_PAGE_LIMIT } from "../db/index.js"
import { formatBridgeTransaction } from "../models/bridgeTransaction.js"
import {queryAndCache} from "../db/queryAndCache.js"

async function query(args) {
    let {includePending, page} = args

    let filter = {}
    if (!includePending) {
        filter['pending'] = false
    }

    return await BRIDGE_TRANSACTIONS_COLLECTION
        .find(filter)
        .sort({ "receivedTime": -1, "sentTime": -1 })
        .skip(DB_PAGE_LIMIT * (page - 1))
        .limit(DB_PAGE_LIMIT)
        .toArray()
}

export async function latestBridgeTransactions(_, args) {

    let queryName = 'latestBridgeTransactions'
    let res = await queryAndCache(queryName, args, query)

    return res.map((txn) => {
        return formatBridgeTransaction(txn)
    })
}

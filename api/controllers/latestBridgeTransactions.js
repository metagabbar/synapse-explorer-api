import { BRIDGE_TRANSACTIONS_COLLECTION, DB_PAGE_LIMIT } from "../db/index.js"
import { formatBridgeTransaction } from "../models/bridgeTransaction.js"
import {queryAndCache} from "../db/utils.js";

async function dbQuery(args) {
    let {includePending, page} = args

    return await BRIDGE_TRANSACTIONS_COLLECTION
        .aggregate([
            {
                $addFields: {
                    "sortField": {
                        $cond: {
                            if: { $ne: [ "$receivedTime", null ] },
                            then: "$receivedTime",
                            else: "$sentTime"
                        }
                    }
                }
            },
            {
                $sort: {
                    "sortField": -1
                }
            },
            {
                $skip: DB_PAGE_LIMIT * (page - 1)
            },
            {
                $limit: DB_PAGE_LIMIT
            }
        ]).toArray()
}

export async function latestBridgeTransactions(_, args) {

    // if (includePending) {
    //     filter['pending'] = true
    // } else {
    //     filter['pending'] = false
    // }

    let queryName = 'latestBridgeTransactions'
    let res = await queryAndCache(queryName, args, dbQuery)

    return res.map((txn) => {
        return formatBridgeTransaction(txn)
    })
}

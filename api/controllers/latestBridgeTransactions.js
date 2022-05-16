import {MongoConnection} from "../utils/db.js";
import {BridgeTransaction} from "../models/bridgeTransaction.js";

export async function latestBridgeTransactions ({
        includePending
    }) {

    let client = await MongoConnection.getClientDb()
    let filter = {}

    if (includePending) {
        filter['pending'] = true
    } else {
        filter['pending'] = false
    }

    let res = await client.collection('bridgetransactions')
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
                $limit: 50
            }
        ]).toArray()

    return res.map((txn) => {
        return new BridgeTransaction(txn)
    })
}

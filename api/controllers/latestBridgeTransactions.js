import { BRIDGE_TRANSACTIONS_COLLECTION } from "../db/index.js"
import { formatBridgeTransaction } from "../models/bridgeTransaction.js"

export async function latestBridgeTransactions() {

    // if (includePending) {
    //     filter['pending'] = true
    // } else {
    //     filter['pending'] = false
    // }

    let res = await BRIDGE_TRANSACTIONS_COLLECTION
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
        return formatBridgeTransaction(txn)
    })
}

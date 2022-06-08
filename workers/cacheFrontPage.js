import {getCurrentTimestamp} from "../api/utils/timeUtils.js";
import {latestBridgeTransactions} from "../api/controllers/latestBridgeTransactions.js";
import {bridgeTransactions} from "../api/controllers/bridgeTransactions.js";

export async function cacheLatestBridgeTransactions() {
    let startTime = getCurrentTimestamp();
    console.log(`Started caching latestBridgeTransactions at ${startTime}`)
    let resList = []
    await latestBridgeTransactions(null, {bypassCache: true, includePending: true, page: 1}).then(async (res) => {
        await Promise.all(
            res.map(async txn => {
                await bridgeTransactions(
                    null,
                    {bypassCache: true, txnHash: txn.fromInfo.txnHash, includePending: false, page: 1}
                ).then(res => {
                    resList.push(res)
                })
            })
        )
        // console.log(resList)
    })
    let endTime = getCurrentTimestamp()
    console.log(`Finished caching latestBridgeTransactions in ${endTime - startTime} seconds at ${endTime}`)
}

import {getCurrentTimestamp} from "../api/utils/timeUtils.js";
import {latestBridgeTransactions} from "../api/controllers/latestBridgeTransactions.js";
import {bridgeTransactions} from "../api/controllers/bridgeTransactions.js";
import {countByTokenAddress} from "../api/controllers/countByTokenAddress.js";
import {countByChainId} from "../api/controllers/countByChainId.js";
import {bridgeAmountStatistic} from "../api/controllers/bridgeAmountStatistic.js";

export async function cacheLatestBridgeTransactions() {
    let startTime = getCurrentTimestamp();
    console.log(`Started caching latestBridgeTransactions at ${startTime}`)
    await latestBridgeTransactions(null, {includePending: true, page: 1}).then(async (res) => {
        for (let txn of res) {
            await bridgeTransactions(null, {txnHash: txn.fromInfo.txnHash, includePending: false, page: 1})
        }
    })
    let endTime = getCurrentTimestamp()
    console.log(`Finished caching latestBridgeTransactions in ${endTime - startTime} seconds at ${endTime}`)
}

export async function cacheCountByTokenId() {
    let startTime = getCurrentTimestamp();
    console.log(`Started caching cacheCountByTokenId at ${startTime}`)
    await countByChainId(null, {direction: "OUT", hours: 24})
    let endTime = getCurrentTimestamp()
    console.log(`Finished caching cacheCountByTokenId in ${endTime - startTime} seconds at ${endTime}`)
}

export async function cacheCountByTokenAddress() {
    let startTime = getCurrentTimestamp();
    console.log(`Started caching cacheCountByTokenAddress at ${startTime}`)
    await countByTokenAddress(null, {direction: "OUT", hours: 24})
    let endTime = getCurrentTimestamp()
    console.log(`Finished caching cacheCountByTokenAddress in ${endTime - startTime} seconds at ${endTime}`)
}

export async function cacheTotalAndCountStatistic() {
    let startTime = getCurrentTimestamp();
    console.log(`Started caching front page statistic at ${startTime}`)
    await bridgeAmountStatistic(null, {type: "COUNT", duration: "ALL_TIME"})
    await bridgeAmountStatistic(null, {type: "TOTAL", duration: "ALL_TIME"})
    let endTime = getCurrentTimestamp()
    console.log(`Finished caching front page statistic in ${endTime - startTime} seconds at ${endTime}`)
}

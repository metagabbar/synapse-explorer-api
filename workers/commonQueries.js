import {getCurrentTimestamp} from "../api/utils/timeUtils.js";

import {countByTokenAddress} from "../api/controllers/countByTokenAddress.js";
import {countByChainId} from "../api/controllers/countByChainId.js";
import {bridgeAmountStatistic} from "../api/controllers/bridgeAmountStatistic.js";
import {bridgeTransactions} from "../api/controllers/bridgeTransactions.js";
import { historicalStatistics } from '../api/controllers/historicalStatistics.js';

export async function cacheBridgeTransactions(chainId) {
    let startTime = getCurrentTimestamp();
    console.log(`Started caching cacheBridgeTransactions for chain ${chainId} at ${startTime}`)
    let args = {bypassCache: true, includePending: true, page: 1, chainId: chainId}

    await bridgeTransactions(null, args).then(async (res) => {
        // Also cache top 3 txns from the result
        // await Promise.all(
        //     res.slice(3).map(async txn => {
        //         await bridgeTransactions(
        //             null,
        //             {bypassCache: true, txnHash: txn.fromInfo.txnHash, includePending: false, page: 1}
        //         )
        //     })
        // )
    })
    let endTime = getCurrentTimestamp()
    console.log(`Finished caching cacheBridgeTransactions for chain ${chainId} in ${endTime - startTime} seconds at ${endTime}`)
}

export async function cacheCountByTokenId(chainId = null) {
    let args = {bypassCache: true, direction: "OUT", hours: 24}
    if (chainId) {
        args["chainId"] = chainId
    }

    let startTime = getCurrentTimestamp();
    console.log(`Started caching cacheCountByTokenId-${chainId ? chainId : ""} at ${startTime}`)
    await countByChainId(null, args)
    let endTime = getCurrentTimestamp()
    console.log(`Finished caching cacheCountByTokenId-${chainId ? chainId : ""} in ${endTime - startTime} seconds at ${endTime}`)
}

export async function cacheCountByTokenAddress(chainId = null) {
    let args = {bypassCache: true, direction: "OUT", hours: 24}
    if (chainId) {
        args["chainId"] = chainId
    }

    let startTime = getCurrentTimestamp();
    console.log(`Started caching cacheCountByTokenAddress-${chainId ? chainId : ""} at ${startTime}`)
    await countByTokenAddress(null, args)
    let endTime = getCurrentTimestamp()
    console.log(`Finished caching cacheCountByTokenAddress-${chainId ? chainId : ""} in ${endTime - startTime} seconds at ${endTime}`)
}

export async function cacheTotalAndCountStatistic(chainId = null) {
    let countArgs = {bypassCache: true, type: "COUNT", duration: "ALL_TIME"}
    let totalArgs = {bypassCache: true, type: "TOTAL", duration: "ALL_TIME"}

    if (chainId) {
        countArgs["chainId"] = chainId
        totalArgs["chainId"] = chainId
    }

    try {
        let startTime = getCurrentTimestamp();
        console.log(`Started caching front page statistic-${chainId ? chainId : ""} at ${startTime}`)
        await bridgeAmountStatistic(null, countArgs)
        await bridgeAmountStatistic(null, totalArgs)
        let endTime = getCurrentTimestamp()
        console.log(`Finished caching front page statistic-${chainId ? chainId : ""} in ${endTime - startTime} seconds at ${endTime}`)
    } catch (err) {
        console.error(`Error in cacheTotalAndCountStatistic - ${err}`)
    }
}

export async function cacheHistoricalStatistics(chainId = null) {
    let bridgeVolumeArgs = { bypassCache: true, type: 'BRIDGEVOLUME' }
    let transactionsArgs = { bypassCache: true, type: 'TRANSACTIONS' }
    let addressesArgs = { bypassCache: true, type: 'ADDRESSES' }

    if (chainId) {
        bridgeVolumeArgs['chainId'] = chainId
        transactionsArgs['chainId'] = chainId
        addressesArgs['chainId'] = chainId
    }

    try {
        let startTime = getCurrentTimestamp();
        console.log(`Started caching historical statistics-${chainId ? chainId : ""} at ${startTime}`)
        await historicalStatistics(null, bridgeVolumeArgs)
        await historicalStatistics(null, transactionsArgs)
        await historicalStatistics(null, addressesArgs)
        let endTime = getCurrentTimestamp()
        console.log(`Finished caching historical statitistics-${chainId ? chainId : ""} in ${endTime - startTime} seconds at ${endTime}`)

    } catch (err) {
        console.error(`Error in cacheHistoricalStatistics-${err}`)
    }
}

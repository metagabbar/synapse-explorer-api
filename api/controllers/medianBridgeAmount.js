import { BRIDGE_TRANSACTIONS_COLLECTION } from "../db/index.js"
import {queryAndCache} from "../db/utils.js"
import {calculateUSDValueForTxnSent, getFormattedValue, getUSDPriceFromAddressOnChain} from "../utils/currencyUtils.js"

export const CACHE_TTL = 3600

export async function query(args) {
    // Build filter
    let filter = {}
    if (Object.keys(args).length > 0) {
        filter = {$or : []}
    }

    if (args.chainId) {
        filter['$or'].push({ fromChainId: args.chainId})
        filter['$or'].push({ toChainId: args.chainId})
    }

    if (args.address) {
        filter['$or'].push({ fromAddress: args.address})
        filter['$or'].push({ toAddress: args.address})
    }

    // Find number of documents
    let docCount = await BRIDGE_TRANSACTIONS_COLLECTION.countDocuments(filter)
    let toSkip = docCount / 2

    // Find median
    let res = await BRIDGE_TRANSACTIONS_COLLECTION
        .find(filter)
        .sort({ sentValue: 1, kappa: 1}).allowDiskUse()
        .collation({locale: "en_US", numericOrdering: true})
        .skip(toSkip)
        .limit(1)
        .toArray()

    let medianTxn = res[0]
    let defaultUSDMedianValue = "3650" // approx fallback median

    let value = await calculateUSDValueForTxnSent(medianTxn)
    value = value ? value : defaultUSDMedianValue

    return {"value": value}
}

export async function medianBridgeAmount(_, args) {
    let queryName = 'median'
    let res = await queryAndCache(queryName, args, query, CACHE_TTL)
    return res
}

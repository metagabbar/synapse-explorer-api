import { BRIDGE_TRANSACTIONS_COLLECTION } from "../db/index.js"
import {queryAndCache} from "../db/utils.js"
import {bignumber, multiply, add} from "mathjs"
import {getTokenSymbolFromAddress} from "../utils/sdkUtils.js"
import {getFormattedValue, getUSDPriceFromAddressOnChain} from "../utils/currencyUtils.js"

async function dbQuery(args) {
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

    let res = await BRIDGE_TRANSACTIONS_COLLECTION.aggregate([
        {
            $match: filter
        }, {
            $project: { "sentValue": 1, "fromChainId" : 1, "sentTokenAddress" : 1}
        }
    ], { cursor: { batchSize: 1 } })

    let cnt = 0
    let sum = bignumber(0)

    for await (const txn of res) {
        if (txn.sentValue) {
            let value = getFormattedValue(txn.sentTokenAddress, txn.fromChainId, txn.sentValue) // Adjust for decimals
            let usdPrice = await getUSDPriceFromAddressOnChain(txn.fromChainId, txn.sentTokenAddress) // Get trading price
            if (usdPrice) {
                let usdValue = multiply(value, usdPrice)
                sum = add(sum, usdValue)
            }
        }
        cnt += 1
    }

    return {"value": cnt.toString()}
}

export async function bridgeTransactionsTotalValue(_, args) {
    let queryName = 'bridgeTransactionsTotalValue'
    let res = await queryAndCache(queryName, args, dbQuery, 1)
    return res
}

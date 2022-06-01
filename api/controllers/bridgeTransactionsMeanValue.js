import { BRIDGE_TRANSACTIONS_COLLECTION } from "../db/index.js"
import {queryAndCache} from "../db/utils.js"
import {ethers, BigNumber} from "ethers"

export const CACHE_TTL = 3600

// TODO: Fix
export async function query(args) {
    let filter = {}
    if (Object.keys(args).length > 0) {
        filter = {$or : []}
    }

    if (args.chainId) {

    }

    if (args.address) {
        filter['$or'].push({ fromAddress: args.address})
        filter['$or'].push({ toAddress: args.address})
    }

    let res = await BRIDGE_TRANSACTIONS_COLLECTION.aggregate([
        {
            $match: filter
        }, {
            $project: { "sentValue": 1}
        }
    ])

    let sum = BigNumber.from(0)
    let cnt = BigNumber.from(0)
    for await (const txn of res) {
        if (txn.sentValue) {
            sum = sum.add(BigNumber.from(txn.sentValue))
            cnt = cnt.add(BigNumber.from(1))
        }
    }

    let weiMean = sum.div(cnt).toString()
    let ethMean = ethers.utils.formatEther(weiMean).toString()
    return {"value": weiMean, "ETHValue": ethMean}
}

export async function bridgeTransactionsMeanValue(_, args) {
    let queryName = 'bridgeTransactionsMeanValue'
    let res = await queryAndCache(queryName, args, query, 1)
    return res
}

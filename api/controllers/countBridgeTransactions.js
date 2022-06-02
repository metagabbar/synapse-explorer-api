import { BRIDGE_TRANSACTIONS_COLLECTION } from "../db/index.js"
import {ethers} from "ethers"
import {validateChainId} from "../validators/validateChainId.js"
import {validateAddress} from "../validators/validateAddress.js"
import {queryAndCache} from "../db/utils.js"
import {getTimestampForPast24Hours} from "../utils/timeUtils.js"

export const QUERY_TTL = 30

async function query(args) {
    let {chainId, address, duration} = args
    let filter = {}
    if (chainId || address) {
        filter = {'$and': []}
    }

    if (chainId) {
        filter['$and'].push({
            '$or': [
                {'fromChainId': chainId},
                {'toChainId': chainId},
            ]
        })
    }

    if (address) {
        validateAddress(address)
        address = ethers.utils.getAddress(address)

        filter['$and'].push({
            '$or': [
                {'fromAddress': address},
                {'toAddress': address},
            ]
        })
    }

    if (duration === "PAST_DAY") {
        let pastDayTimestamp = getTimestampForPast24Hours()
        filter['$and'].push({ receivedTime: { $gte: pastDayTimestamp } })
    }

    let res = await BRIDGE_TRANSACTIONS_COLLECTION.countDocuments(filter)
    return {"value" : res}
}

export async function countBridgeTransactions(_, args) {

    if (args.chainId) {
        validateChainId(args.chainId)
    }
    if (args.address) {
        validateAddress(args.address)
        args.address = ethers.utils.getAddress(args.address)
    }

    let queryName = 'countBridgeTransactions'
    let res = await queryAndCache(queryName, args, query, QUERY_TTL)

    return res
}

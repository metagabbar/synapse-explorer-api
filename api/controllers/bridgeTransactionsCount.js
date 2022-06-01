import { BRIDGE_TRANSACTIONS_COLLECTION } from "../db/index.js"
import {ethers} from "ethers"
import {validateChainId} from "../validators/validateChainId.js"
import {validateAddress} from "../validators/validateAddress.js"
import {queryAndCache} from "../db/utils.js"

async function dbQuery(args) {
    let {chainId, address} = args
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

    let res = await BRIDGE_TRANSACTIONS_COLLECTION.countDocuments(filter)
    return {"value" : res}
}

export async function bridgeTransactionsCount(_, args) {

    if (args.chainId) {
        validateChainId(args.chainId)
    }
    if (args.address) {
        validateAddress(args.address)
        args.address = ethers.utils.getAddress(args.address)
    }

    let queryName = 'bridgeTransactionsCount'
    let expireIn = 15
    let res = await queryAndCache(queryName, args, dbQuery, expireIn)

    return res
}

import {GraphQLError} from "graphql"
import { formatBridgeTransaction } from "../models/bridgeTransaction.js"
import { BRIDGE_TRANSACTIONS_COLLECTION, DB_PAGE_LIMIT } from "../db/index.js"
import {validateChainId} from "../validators/validateChainId.js"
import {validateAddress} from "../validators/validateAddress.js"
import {ethers} from "ethers"
import {queryAndCache} from "../db/utils.js"

async function query(args) {
    let { chainId, address, txnHash, kappa, page} = args

    let filter = {'$and': []}

    if (chainId) {
        filter['$and'].push({
            '$or': [
                {'fromChainId': chainId},
                {'toChainId': chainId},
            ]
        })
    }

    if (address) {
        filter['$and'].push({
            '$or': [
                {'fromAddress': address},
                {'toAddress': address},
            ]
        })
    }

    if (txnHash) {
        filter['$and'].push({
            '$or': [
                {'fromTxnHash': txnHash},
                {'toTxnHash': txnHash},
            ]
        })
    }

    if (kappa) {
        filter['$and'].push({
            'kappa': kappa
        })
    }

    // Only return completed transactions here
    filter['$and'].push({
        'pending': false
    })

    console.log("Skipping ", DB_PAGE_LIMIT * (page-1))

    return await BRIDGE_TRANSACTIONS_COLLECTION
        .find(filter)
        .sort({"sentTime": -1})
        .skip(DB_PAGE_LIMIT * (page-1))
        .limit(DB_PAGE_LIMIT)
        .toArray()
}

export async function bridgeTransactions(_, args) {

    // Basic validation
    if (Object.keys(args).length === 0) {
        throw new GraphQLError('a minimum of 1 parameter is required to filter results')
    }
    if (args.chainId) {
        validateChainId(args.chainId)
    }
    if (args.address) {
        validateAddress(args.address)
        args.address = ethers.utils.getAddress(args.address)
    }

    let queryName = 'bridgeTransactions'
    let res = await queryAndCache(queryName, args, query)

    return res.map((txn) => {
        return formatBridgeTransaction(txn)
    })
}
import {UserInputError} from "apollo-server"
import { formatBridgeTransaction } from "../models/bridgeTransaction.js"
import { BRIDGE_TRANSACTIONS_COLLECTION, DB_PAGE_LIMIT } from "../db/index.js"
import {validateChainId} from "../validators/validateChainId.js"
import {validateAddress} from "../validators/validateAddress.js"
import {ethers} from "ethers"
import {queryAndCache} from "../db/queryAndCache.js"

const QUERY_TTL_MINUTE = 60
const QUERY_TTL_DAY = 60 * 60 * 24

async function query(args) {
    let { tokenAddress, chainId, address, txnHash, kappa, page, includePending} = args

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

    if (tokenAddress) {
        filter['$and'].push({
            '$or': [
                {'sentTokenAddress': tokenAddress},
                {'receivedTokenAddress': tokenAddress},
            ]
        })
    }

    // Only return completed transactions here
    if (!includePending) {
        filter['$and'].push({
            'pending': false
        })
    }

    return await BRIDGE_TRANSACTIONS_COLLECTION
        .find(filter)
        .sort({"sentTime": -1})
        .skip(DB_PAGE_LIMIT * (page-1))
        .limit(DB_PAGE_LIMIT)
        .toArray()
}

export async function bridgeTransactions(_, args) {

    // Basic validation
    if (!args.tokenAddress && !args.chainId && !args.address && !args.txnHash && !args.kappa) {
        throw new UserInputError('a minimum of 1 search parameter is required to filter results')
    }

    // If chain is not passed, txn result will stay static and can be cached for longer
    let cacheTTL = QUERY_TTL_DAY

    if (args.chainId) {
        validateChainId(args.chainId)
        cacheTTL = QUERY_TTL_MINUTE
    }

    if (args.address) {
        validateAddress(args.address)
        args.address = ethers.utils.getAddress(args.address)
    }

    if (args.tokenAddress) {
        validateAddress(args.tokenAddress)
        args.tokenAddress = ethers.utils.getAddress(args.tokenAddress)
    }

    let queryName = 'bridgeTransactions'
    let res = await queryAndCache(queryName, args, query, cacheTTL)

    return res.map((txn) => {
        return formatBridgeTransaction(txn)
    })
}
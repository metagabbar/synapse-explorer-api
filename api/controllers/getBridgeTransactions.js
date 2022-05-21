import {formatBridgeTransaction} from "../models/bridgeTransaction.js"
import { BRIDGE_TRANSACTIONS_COLLECTION } from "../db/index.js"
import {ethers} from "ethers"

export async function getBridgeTransactions ({
    chainId,
    address,
    txnHash,
    kappa
}) {

    if (address) {
        address = ethers.utils.getAddress(address);
    }

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

    let res = await BRIDGE_TRANSACTIONS_COLLECTION
        .find(filter)
        .limit(50)
        .toArray()

    return res.map((txn) => {
        return formatBridgeTransaction(txn)
    })
}
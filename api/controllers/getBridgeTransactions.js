import {BridgeTransaction} from "../models/bridgeTransaction.js";
import {MongoConnection} from "../utils/db.js";

export async function getBridgeTransactions ({
        chainId,
        address,
        txnHash,
        kappa
    }) {

    let client = await MongoConnection.getClientDb()
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

    let res = await client.collection('bridgetransactions')
        .find(filter)
        .limit(50)
        .toArray()

    return res.map((txn) => {
        return new BridgeTransaction(txn)
    })
}
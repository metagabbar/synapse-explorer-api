import { ethers } from "ethers"
import { formatBridgeTransaction } from "../models/bridgeTransaction.js"
import { BRIDGE_TRANSACTIONS_COLLECTION } from "../db/index.js"
import {validateChainId} from "../validators/validateChainId.js";
import {GraphQLError} from "graphql";


export async function bridgeTransactions({
    chainId,
    address,
    txnHash,
    kappa
}) {

    if (!chainId && !address && !txnHash && !kappa) {
        throw new GraphQLError('a minimum of 1 parameter is required to filter results');
    }

    let filter = {'$and': []}

    if (chainId) {
        validateChainId(chainId);

        filter['$and'].push({
            '$or': [
                {'fromChainId': chainId},
                {'toChainId': chainId},
            ]
        })
    }

    if (address) {
        validateChainId(address);

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

    let res = await BRIDGE_TRANSACTIONS_COLLECTION
        .find(filter)
        .sort({"sentTime": -1})
        .limit(50)
        .toArray()

    return res.map((txn) => {
        return formatBridgeTransaction(txn)
    })
}
import {BridgeTransaction} from "./bridgeTransaction.js";
import {MongoConnection} from "./db.js";

export async function getBridgeTransactions ({
        chainIdFrom,
        chainIdTo,
        addressFrom,
        addressTo,
        txnToHash,
        txnFromHash,
        kappa
    }) {
    let client = await MongoConnection.getClient()
    let filter = {}

    if (chainIdFrom) {
        filter['fromChainId'] = chainIdFrom
    }
    if (chainIdTo) {
        filter['toChainId'] = chainIdTo
    }
    if (addressFrom) {
        filter['fromAddress'] = addressFrom
    }
    if (addressTo) {
        filter['toAddress'] = addressTo
    }
    if (txnToHash) {
        filter['toTxnHash'] = txnToHash
    }
    if (txnFromHash) {
        filter['fromTxnHash'] = txnFromHash
    }
    if (kappa) {
        filter['kappa'] = kappa
    }

    // TODO order by date
    // TODO cache
    let resCursor = await client.collection('bridgetransactions')
        .find(filter)
        .limit(50)

    let results = []

    for await (const txn of resCursor) {
        results.push(
            new BridgeTransaction(txn)
        );
    }

    return results;
}
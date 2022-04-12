import {Transaction} from "./transaction.js";
import {MongoConnection} from "./db.js";

export async function getTransactions ({
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
        filter['from_chain_id'] = chainIdFrom
    }
    if (chainIdTo) {
        filter['from_chain_to'] = chainIdTo
    }
    if (addressFrom) {
        filter['from_address'] = addressFrom
    }
    if (addressTo) {
        filter['to_address'] = addressTo
    }
    if (txnToHash) {
        filter['to_tx_hash'] = txnToHash
    }
    if (txnFromHash) {
        filter['from_tx_hash'] = txnFromHash
    }
    if (kappa) {
        filter['kappa'] = kappa
    }

    // TODO order by date
    // TODO cache
    let resCursor = await client.collection('transactions')
        .find(filter)
        .limit(50)

    let results = []

    for await (const txn of resCursor) {
        results.push(
            new Transaction(txn)
        );
    }

    return results;
}
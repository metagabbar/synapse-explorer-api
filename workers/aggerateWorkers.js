// Run workers to cache aggregate query results
import {queryAndCache} from "../api/db/utils.js"
import * as bridgeTransactionsMedianValue from "../api/controllers/bridgeTransactionsMedianValue.js"
import * as bridgeTransactionsMeanValue from "../api/controllers/bridgeTransactionsMeanValue.js"
import {CACHE_TTL} from "../api/controllers/bridgeTransactionsMedianValue.js"

async function computebridgeTransactionMedianValue() {
    // TODO for all chains
    await queryAndCache(
        'bridgeTransactionsMedianValue',
        {},
        bridgeTransactionsMedianValue.query,
        bridgeTransactionsMedianValue.CACHE_TTL
    )
}

async function computeMean() {
    // TODO for all chains
    await queryAndCache(
        'bridgeTransactionsMeanValue',
        {},
        bridgeTransactionsMeanValue.query,
        bridgeTransactionsMeanValue.CACHE_TTL
    )
}

async function computeMean() {
    // TODO for all chains
    await queryAndCache(
        'bridgeTransactionsMeanValue',
        {},
        bridgeTransactionsMeanValue.query,
        bridgeTransactionsMeanValue.CACHE_TTL
    )
}

setInterval(computeMedian, bridgeTransactionsMedianValue.CACHE_TTL/2)
setInterval(computeMean, bridgeTransactionsMeanValue.CACHE_TTL/2)
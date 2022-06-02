// Run workers to cache aggregate query results
import {queryAndCache} from "../api/db/utils.js"
import * as medianBridgeAmount from "../api/controllers/medianBridgeAmount.js"
import * as meanBridgeAmount from "../api/controllers/meanBridgeAmount.js"
import {CACHE_TTL} from "../api/controllers/medianBridgeAmount.js"

async function computebridgeTransactionMedianValue() {
    // TODO for all chains
    await queryAndCache(
        'medianBridgeAmount',
        {},
        medianBridgeAmount.query,
        medianBridgeAmount.CACHE_TTL
    )
}

async function computeMean() {
    // TODO for all chains
    await queryAndCache(
        'meanBridgeAmount',
        {},
        meanBridgeAmount.query,
        meanBridgeAmount.CACHE_TTL
    )
}

async function computeMean() {
    // TODO for all chains
    await queryAndCache(
        'meanBridgeAmount',
        {},
        meanBridgeAmount.query,
        meanBridgeAmount.CACHE_TTL
    )
}

setInterval(computeMedian, medianBridgeAmount.CACHE_TTL/2)
setInterval(computeMean, meanBridgeAmount.CACHE_TTL/2)
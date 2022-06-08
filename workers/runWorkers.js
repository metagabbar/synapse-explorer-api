import "./config.js"

import {cacheCountByTokenAddress, cacheCountByTokenId, cacheTotalAndCountStatistic} from "./commonQueries.js";
import {cacheLatestBridgeTransactions} from "./cacheFrontPage.js";
import {cacheChainData} from "./cacheChainPage.js";

import {ChainId} from "@synapseprotocol/sdk";


// Cache data for all chain pages
async function cacheAllChainData() {
    let allChainData = []
    for (let chainId of Object.values(ChainId)) {
        allChainData.push(
            cacheChainData(chainId)
        )
    }
    await Promise.all(allChainData)
}
setInterval(cacheAllChainData, 40 * 1000)

// Caching data for front page
setInterval(cacheLatestBridgeTransactions, 20 * 1000)
setInterval(cacheCountByTokenId, 10 * 1000)
setInterval(cacheCountByTokenAddress, 10 * 1000)
setInterval(cacheTotalAndCountStatistic, 20 * 1000)


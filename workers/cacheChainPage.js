import {cacheBridgeTransactions, cacheCountByTokenId, cacheCountByTokenAddress, cacheTotalAndCountStatistic} from "./commonQueries.js";

export async function cacheChainData(chainId) {
    await Promise.all([
        cacheBridgeTransactions(chainId),
        cacheCountByTokenId(chainId),
        cacheCountByTokenAddress(chainId),
        cacheTotalAndCountStatistic(chainId)
    ])
}

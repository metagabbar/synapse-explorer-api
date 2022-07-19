import {
  cacheBridgeTransactions,
  cacheCountByTokenId,
  cacheCountByTokenAddress,
  cacheTotalAndCountStatistic,
  cacheHistoricalStatistics,
} from './commonQueries.js'

export async function cacheChainData(chainId) {
  await Promise.all([
    cacheBridgeTransactions(chainId),
    cacheCountByTokenId(chainId),
    cacheCountByTokenAddress(chainId),
    cacheTotalAndCountStatistic(chainId),
    cacheHistoricalStatistics(chainId),
  ])
}

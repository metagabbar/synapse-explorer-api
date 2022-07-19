import './config.js'

import {
  cacheCountByTokenAddress,
  cacheCountByTokenId,
  cacheTotalAndCountStatistic,
  cacheHistoricalStatistics,
} from './commonQueries.js'
import { cacheLatestBridgeTransactions } from './cacheFrontPage.js'
import { cacheChainData } from './cacheChainPage.js'
import { ChainId } from '@synapseprotocol/sdk'

// Caching data for front page
setInterval(cacheLatestBridgeTransactions, 20 * 1000)
setInterval(cacheCountByTokenId, 10 * 1000)
setInterval(cacheCountByTokenAddress, 10 * 1000)
setInterval(cacheTotalAndCountStatistic, 20 * 1000)
setInterval(cacheHistoricalStatistics, 3600 * 1000)

// Cache data for all chain pages
for (let chainId of Object.values(ChainId)) {
  setInterval(cacheChainData, 30 * 1000, chainId)
}

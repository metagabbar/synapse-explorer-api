import "./config.js"
import {cacheLatestBridgeTransactions, cacheCountByTokenId, cacheCountByTokenAddress, cacheTotalAndCountStatistic} from "./frontPage.js";

setInterval(cacheLatestBridgeTransactions, 45 * 1000)
setInterval(cacheCountByTokenId, 10 * 1000)
setInterval(cacheCountByTokenAddress, 10 * 1000)
setInterval(cacheTotalAndCountStatistic, 35 * 1000)

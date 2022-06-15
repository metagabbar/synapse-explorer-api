import {queryAndCache} from "../db/queryAndCache.js"
import {ethers} from "ethers";
import {validateChainId} from "../validators/validateChainId.js";
import {validateAddress} from "../validators/validateAddress.js";
import {meanQuery} from "../queries/statistic/meanQuery.js";
import {medianQuery} from "../queries/statistic/medianQuery.js";
import {totalQuery} from "../queries/statistic/totalQuery.js";
import {countQuery} from "../queries/statistic/countQuery.js";

export const CACHE_TTL = 60

export async function bridgeAmountStatistic(_, args) {

    // Validation
    if (args.chainId) {
        validateChainId(args.chainId)
    }
    if (args.address) {
        validateAddress(args.address)
        args.address = ethers.utils.getAddress(args.address)
    }

    if(args.tokenAddress) {
        validateAddress(args.tokenAddress)
        args.tokenAddress = ethers.utils.getAddress(args.tokenAddress)
    }

    let queryName = 'bridgeAmountStatistic'

    // Determine query callable based on statistic type
    let statisticQueryFn;
    if (args.type === "MEAN") {
        statisticQueryFn = meanQuery
    } else if (args.type === "MEDIAN") {
        statisticQueryFn = medianQuery
    } else if (args.type === "TOTAL") {
        statisticQueryFn = totalQuery
    } else if (args.type === "COUNT") {
        statisticQueryFn = countQuery
    }

    let res = await queryAndCache(queryName, args, statisticQueryFn, CACHE_TTL)
    return res
}

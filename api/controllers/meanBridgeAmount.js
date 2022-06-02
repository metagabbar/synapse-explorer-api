import {queryAndCache} from "../db/utils.js"
import {totalBridgeAmount, QUERY_TTL} from "./totalBridgeAmount.js";
import {countBridgeTransactions} from "./countBridgeTransactions.js";
import {FixedNumber} from "ethers";

export const CACHE_TTL = 60

export async function query(args) {
    let totalVal = await totalBridgeAmount(null, args)
    let cntVal = await countBridgeTransactions(null, args)

    // Avoid div by 0
    let mean = "0"
    if (totalVal.value && cntVal?.value.toString() !== "0") {
        mean = FixedNumber.from(totalVal.value.toString()).divUnsafe(FixedNumber.from(cntVal.value.toString()))
    }
    return {"value": mean.toString()}
}

export async function meanBridgeAmount(_, args) {
    let queryName = 'meanBridgeAmount'
    let res = await queryAndCache(queryName, args, query, QUERY_TTL)
    return res
}

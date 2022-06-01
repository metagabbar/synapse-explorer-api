import {queryAndCache} from "../db/utils.js"
import {getAllTimeTotalForChains, getPastDayTotalForChains} from "../utils/analyticsUtils.js";

async function query(args) {
    let total = "0"
    let chainId = args.chainId ? args.chainId : 0

    if (args.duration === "PAST_DAY") {
        total = await getPastDayTotalForChains(chainId)
    } else if (args.duration === "ALL_TIME") {
        total = await getAllTimeTotalForChains(chainId)
    }

    return {"value": total.toString()}
}

export async function bridgeTransactionsTotalValue(_, args) {
    let queryName = 'bridgeTransactionsTotalValue'
    let res = await queryAndCache(queryName, args, query, 1)
    return res
}

import {queryAndCache} from "../db/utils.js"
import {getAllTimeTotalForChains, getPastDayTotalForChains} from "../utils/analyticsAPIUtils.js"
import {BRIDGE_TRANSACTIONS_COLLECTION} from "../db/index.js"
import {FixedNumber} from "ethers"
import {getFormattedValue, getUSDPriceFromAddressOnChain} from "../utils/currencyUtils.js"
import {getTimestampForPast24Hours} from "../utils/timeUtils.js"

export const QUERY_TTL = 60

async function query(args) {
    let sum = FixedNumber.from("0")
    let {address, chainId, duration} = args

    if (!address) {
        // Non-specific address data required, get from analytics API
        chainId = chainId ? chainId : 0

        if (duration === "PAST_DAY") {
            // TODO: Shift to DB query. This is somewhat inaccurate
            sum = await getPastDayTotalForChains(chainId)
        } else if (duration === "ALL_TIME") {
            sum = await getAllTimeTotalForChains(chainId)
        }
    } else {

        // Filter for user address
        let filter = {$and : []}
        let addressFilter = {'$or' : [{ fromAddress: address}, { toAddress: address}]}
        filter['$and'].push(addressFilter)

        // Further, filter for chain
        if (chainId) {
            let chainIdFilter = {'$or' : [{ fromChainId: chainId}, { toChainId: chainId}]}
            filter['$and'].push(chainIdFilter)
        }

        // Filter for duration, if 24 hours or all time
        if (duration === "PAST_DAY") {
            let pastDayTimestamp = getTimestampForPast24Hours()
            filter['$and'].push({ receivedTime: { $gte: pastDayTimestamp } })
        }

        // Get amount for user
        let res = await BRIDGE_TRANSACTIONS_COLLECTION.find(filter)
        for await (const txn of res) {
            let value = getFormattedValue(txn.sentTokenAddress, txn.fromChainId, txn.sentValue) // Adjust for decimals
            let usdPrice = await getUSDPriceFromAddressOnChain(txn.fromChainId, txn.sentTokenAddress) // Get trading price
            if (usdPrice) {
                sum=sum.addUnsafe(value.mulUnsafe(usdPrice))
            }
        }

    }

    return {"value": sum.toString()}
}

export async function bridgeTransactionsTotalValue(_, args) {
    let queryName = 'bridgeTransactionsTotalValue'
    let res = await queryAndCache(queryName, args, query, QUERY_TTL)
    return res
}

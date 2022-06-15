import {validateAddress} from "../../validators/validateAddress.js"
import {ethers} from "ethers"
import {getTimestampForPast24Hours} from "../../utils/timeUtils.js"
import {BRIDGE_TRANSACTIONS_COLLECTION} from "../../db/index.js"

export async function countQuery(args) {
    let {tokenAddress, chainId, address, duration} = args
    let filter = {}
    if (chainId || address) {
        filter = {'$and': []}
    }

    if (chainId) {
        filter['$and'].push({
            '$or': [
                {'fromChainId': chainId},
                {'toChainId': chainId},
            ]
        })
    }

    if (address) {
        validateAddress(address)
        address = ethers.utils.getAddress(address)

        filter['$and'].push({
            '$or': [
                {'fromAddress': address},
                {'toAddress': address},
            ]
        })
    }

    if (tokenAddress) {
        filter['$and'].push({
            '$or': [
                {'sentTokenAddress': tokenAddress},
                {'receivedTokenAddress': tokenAddress},
            ],
        })
    }

    if (duration === "PAST_DAY") {
        let pastDayTimestamp = getTimestampForPast24Hours()
        filter['$and'].push({ receivedTime: { $gte: pastDayTimestamp } })
    }

    let res = await BRIDGE_TRANSACTIONS_COLLECTION.countDocuments(filter)
    return {"USDValue" : res}
}

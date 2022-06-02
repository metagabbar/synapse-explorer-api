import fetch from "node-fetch"
import {FixedNumber} from "ethers"
import {ChainId} from "@synapseprotocol/sdk"

/**
 * Converts chain id to synapse analytics chain id
 *
 * @param {Number} chainId
 * @return {string|null}
 */
function getAnalyticsNameFromChainId(chainId) {
    for (let chainName of Object.keys(ChainId)) {
        if (ChainId[chainName].toString() === chainId.toString()) {
            chainName = chainName === "ETH" ? "ethereum" : chainName
            return chainName.toLowerCase()
        }
    }
    return null
}


/***
 * Gets Day total for all chains if chainId is 0 else for a particular chain id
 * @param chainId
 * @param direction
 * @return {Promise<FixedNumber|null>}
 */
export async function getAllTimeTotalForChains(chainId, direction="OUT") {
    try {
        let res = await fetch(`https://synapse.dorime.org/api/v1/analytics/volume/total/${direction.toLowerCase()}`, {})
        let parsedJson = await res.json()

        // All chains
        if (chainId.toString() === "0") {
            let total = FixedNumber.from("0")
            for (let chainTotal of Object.values(parsedJson["totals"])) {
                total = total.addUnsafe(FixedNumber.from(chainTotal.toString()))
            }
            return total
        }

        // Chain Id
        let chainName = getAnalyticsNameFromChainId(chainId)
        if (chainName in parsedJson["totals"]) {
            return FixedNumber.from(parsedJson["totals"][chainName].toString())
        } else {
            console.error("nothing found for chain name", chainName)
        }
        return null
    } catch (err) {
        console.error(err)
    }
}

/***
 * Gets Day total for all chains if chainId is 0 else particular chain id
 * @param chainId
 * @param direction
 * @return {Promise<FixedNumber|null>}
 */
export async function getPastDayTotalForChains(chainId, direction="OUT") {
    try {
        let res = await fetch(`https://synapse.dorime.org/api/v1/analytics/volume/total/${direction.toLowerCase()}`, {})
        let parsedJson = await res.json()
        let dates = Object.keys(parsedJson["data"])
        let lastDate = dates[dates.length - 2]
        let lastEntry = parsedJson["data"][lastDate]

        // All chains
        if (chainId.toString() === "0") {
            return FixedNumber.from(lastEntry["total"].toString())
        }

        // chain id
        let chainName = getAnalyticsNameFromChainId(chainId)
        if (chainName in lastEntry) {
            return FixedNumber.from(lastEntry[chainName].toString())
        }
        return null
    } catch (err) {
        console.error(err)
    }
}


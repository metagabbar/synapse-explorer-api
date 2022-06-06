import {getDecimalsForChainFromTokenAddress, getDivisorForDecimals, getTokenSymbolFromAddress} from "./sdkUtils.js"
import {BaseToken, Tokens} from "@synapseprotocol/sdk"
import fetch from "node-fetch"
import {FixedNumber} from "ethers"

let TOKEN_SYMBOLS = []
let PRICE_MAP = {}

Object.keys(Tokens).forEach(async key => {
    if (Tokens[key] instanceof BaseToken) {
        TOKEN_SYMBOLS.push(key)
    }
})

/***
 * Takes in a wei-ish sentValue and converts it to actual number of tokens
 * sent or received depending on the decimals supported by token
 * @param tokenAddress
 * @param chainId
 * @param sentValue
 * @param receivedValue
 * @return {FixedNumber|null}
 */
export function getFormattedValue(tokenAddress, chainId, sentValue, receivedValue=null) {
    try {
        if (!sentValue) {
            return null
        }

        // GMX sentValue is ridiculous
        let value = sentValue
        let symbol = getTokenSymbolFromAddress(chainId, tokenAddress)
        if (symbol === "GMX") {
            if (!receivedValue) {
                return FixedNumber.from("0")
            }
            value = receivedValue
        }

        let decimals = getDecimalsForChainFromTokenAddress(chainId, tokenAddress)
        let res = FixedNumber.from(value).divUnsafe(getDivisorForDecimals(decimals))
        return res
    } catch (err) {
        console.error(err)
    }
    return null
}

/***
 * Returns price for address on a chain as a FixedNumber
 *
 * @param chainId
 * @param tokenAddress
 * @return {Promise<FixedNumber|*>}
 */
export async function getUSDPriceFromAddressOnChain(chainId, tokenAddress) {
    let tokenSymbol = getTokenSymbolFromAddress(chainId, tokenAddress)
    if (!tokenSymbol) {
        return FixedNumber.from(0)
    }
    return await getUSDPriceFromSymbol(tokenSymbol)
}

/***
 * Returns price of token as a FixedNumber
 *
 * @param tokenSymbol
 * @return {Promise<FixedNumber|*>}
 */
export async function getUSDPriceFromSymbol(tokenSymbol) {

    // Normalize weird tokens
    tokenSymbol = tokenSymbol.includes("ETH") ? "ETH" : tokenSymbol
    tokenSymbol = tokenSymbol.includes("FRAX") ? "FRAX" : tokenSymbol
    tokenSymbol = tokenSymbol.includes("AVAX") ? "AVAX" : tokenSymbol
    tokenSymbol = tokenSymbol.includes("JEWEL") ? "JEWEL" : tokenSymbol
    tokenSymbol = tokenSymbol.includes("WMOVR") ? "MOVR" : tokenSymbol
    tokenSymbol = tokenSymbol ===  "NUSD" ? "USDC" : tokenSymbol
    tokenSymbol = tokenSymbol === "USDB" ? "USDC" : tokenSymbol

    if (!TOKEN_SYMBOLS.includes(tokenSymbol)) {
        console.log("No price found for ", tokenSymbol)
        return
    }

    let tokenSymbolIgnoreList = ["UST", "GMX"]
    if (tokenSymbolIgnoreList.includes(tokenSymbol)) {
        return FixedNumber.from("0")
    }

    // TODO: Move to redis!
    if (tokenSymbol in PRICE_MAP) {
        return PRICE_MAP[tokenSymbol]
    }

    try {
        let res = await fetch(`https://min-api.cryptocompare.com/data/price?fsym=${tokenSymbol}&tsyms=USD`, {})
        let parsedJson = await res.json()
        if ("USD" in parsedJson) {
            return PRICE_MAP[tokenSymbol] = FixedNumber.from(parsedJson["USD"].toString())
        }
    } catch (err) {
        console.log(err)
    }
}

/**
 * Takes in a value and bridgeTxn to calculate the USD price of that value wrt sent transaction
 * @param bridgeTxn
 * @return {Promise<string>}
 */
export async function calculateUSDValueForTxnSent(bridgeTxn) {
    if (bridgeTxn) {
        let value = getFormattedValue(bridgeTxn.sentTokenAddress, bridgeTxn.fromChainId, bridgeTxn.sentValue) // Adjust for decimals
        let usdPrice = await getUSDPriceFromAddressOnChain(bridgeTxn.fromChainId, bridgeTxn.sentTokenAddress) // Get trading price
        if (value && usdPrice) {
            return value.mulUnsafe(usdPrice).toString()
        }
    }
    return "0"
}
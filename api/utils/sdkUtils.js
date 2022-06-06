import _ from 'lodash'
import {BaseToken, Tokens, ChainId} from "@synapseprotocol/sdk"
import {FixedNumber, ethers} from "ethers"


let INVERTED_CHAIN_ID = {}
for (const [chainName, chainId] of _.entries(ChainId)) {
    INVERTED_CHAIN_ID[chainId] = chainName
}
export function getNetworkNameFromId(id) {
    return INVERTED_CHAIN_ID[id]
}


let ADDRESS_SYMBOL_MAP = {}
let ADDRESS_TOKEN_MAP = {}
let BIGNUMBER_DECIMAL_MAP = {}

for (const chainId of _.values(ChainId)) {
    ADDRESS_SYMBOL_MAP[chainId] = {}
    ADDRESS_TOKEN_MAP[chainId] = {}
    for (const [symbol, token] of _.entries(Tokens)) {
        if (Tokens[symbol] instanceof BaseToken) {
            const lowerAddress = Tokens[symbol].addresses[chainId]?.toLowerCase()
            ADDRESS_SYMBOL_MAP[chainId][lowerAddress] = symbol
            ADDRESS_TOKEN_MAP[chainId][lowerAddress] = Tokens[symbol]
        }
    }
}

/**
 * Takes in a token symbol and returns the chain native symbol if wrapped, or else returns the input
 * @param {Number} chainId
 * @param {String} wSymbol
 * @return {String}
 */
function getNativeSymbolForChainIfWrapped(chainId, wSymbol) {
    let nSymbol = wSymbol
    if (chainId === ChainId.ETH && wSymbol.toUpperCase() === "WETH") {
        nSymbol = "ETH"
    } else if ((chainId === ChainId.AVALANCHE || chainId === ChainId.DFK) && wSymbol.toUpperCase() === "WAVAX") {
        nSymbol = "AVAX"
    } else if (chainId === ChainId.MOONRIVER && wSymbol.toUpperCase() === "WMOVR") {
        nSymbol = "MOVR"
    }
    return nSymbol
}


/**
 * Gets token symbol for contract address on chain
 * @param {String | Number} chainId
 * @param {String} address
 * @return {null|*}
 */
export function getTokenSymbolFromAddress(chainId, address) {
    if (!chainId || !address) {
        return null
    }
    let symbol = ADDRESS_SYMBOL_MAP[chainId.toString()][address?.toLowerCase()]
    try {
        symbol = getNativeSymbolForChainIfWrapped(parseInt(chainId), symbol)
    } catch (err) {
        // Should never happen, but possibly due to parseInt
        console.log(err);
    }
    return symbol
}

export function getDecimalsForChainFromTokenAddress(chainId, address) {
    if (!chainId || !address) {
        return null
    }
    return ADDRESS_TOKEN_MAP[chainId][address?.toLowerCase()]?.decimals(chainId)
}

export function getDivisorForDecimals(decimals) {
    if (decimals in BIGNUMBER_DECIMAL_MAP) {
        return BIGNUMBER_DECIMAL_MAP[decimals]
    }
    return BIGNUMBER_DECIMAL_MAP[decimals] = FixedNumber.from(
        ethers.utils.parseUnits("1", decimals)
    )
}

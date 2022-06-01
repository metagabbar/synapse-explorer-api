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

export function getTokenSymbolFromAddress(chainId, address) {
    if (!chainId || !address) {
        return null
    }
    return ADDRESS_SYMBOL_MAP[chainId.toString()][address?.toLowerCase()]
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

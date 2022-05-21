import _ from 'lodash'
import {BaseToken, Tokens, ChainId} from "@synapseprotocol/sdk"


let INVERTED_CHAIN_ID = {}
for (const [chainName, chainId] of _.entries(ChainId)) {
    INVERTED_CHAIN_ID[chainId] = chainName
}
export function getNetworkNameFromId(id) {
    return INVERTED_CHAIN_ID[id]
}


let ADDRESS_SYMBOL_MAP = {}
for (const chainId of _.values(ChainId)) {
    ADDRESS_SYMBOL_MAP[chainId] = {}
    for (const [symbol, token] of _.entries(Tokens)) {
        if (Tokens[symbol] instanceof BaseToken) {
            const lowerAddress = Tokens[symbol].addresses[chainId]?.toLowerCase()
            ADDRESS_SYMBOL_MAP[chainId][lowerAddress] = symbol
        }
    }
}

export function getTokenSymbolFromAddress(chainId, address) {
    return ADDRESS_SYMBOL_MAP[chainId][address.toLowerCase()]
}

import {BaseToken, Tokens, ChainId} from "@synapseprotocol/sdk"

let ADDRESS_SYMBOL_CACHE = {}

export function getNetworkNameFromId(id) {
    for (let key of Object.keys(ChainId)) {
        if (id === ChainId[key]) {
            return key;
        }
    }
}

export function getTokenSymbolFromAddress(chainId, address) {
    if (address in ADDRESS_SYMBOL_CACHE) {
        return ADDRESS_SYMBOL_CACHE[address];
    }

    for (let key of Object.keys(Tokens)) {
        if (Tokens[key] instanceof BaseToken) {
            if (Tokens[key].addresses[chainId] &&
                Tokens[key].addresses[chainId].toLowerCase() === address.toLowerCase()) {
                return ADDRESS_SYMBOL_CACHE[address] = key;
            }
        }
    }
}

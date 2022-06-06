import {ChainId} from "@synapseprotocol/sdk"
import {ValidationError} from "apollo-server"

export function validateChainId(chainId) {

    if (!Object.values(ChainId).includes(chainId)) {
        throw new ValidationError('invalid chain id')
    }
}

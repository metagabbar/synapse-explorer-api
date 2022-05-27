import {ChainId} from "@synapseprotocol/sdk";
import {UserInputError} from "apollo-server"

export function validateChainId(chainId) {

    if (!Object.values(ChainId).includes(chainId)) {
        throw new UserInputError('invalid chain id');
    }
}

import {GraphQLError} from "graphql";
import {ChainId} from "@synapseprotocol/sdk";

export function validateChainId(chainId) {

    if (!Object.values(ChainId).includes(chainId)) {
        throw new GraphQLError('invalid chain id');
    }
}

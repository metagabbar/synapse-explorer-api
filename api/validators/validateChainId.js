import {ChainId} from "@synapseprotocol/sdk";
import { GraphQLYogaError } from '@graphql-yoga/node'

export function validateChainId(chainId) {

    if (!Object.values(ChainId).includes(chainId)) {
        throw new GraphQLYogaError('invalid chain id');
    }
}

import {ethers} from "ethers";
import { GraphQLYogaError } from '@graphql-yoga/node'

export function validateAddress(address) {
    if (!ethers.utils.isAddress(address)) {
        throw new GraphQLYogaError('invalid address');
    }
}

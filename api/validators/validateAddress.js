import {ethers} from "ethers";
import {GraphQLError} from "graphql";

export function validateAddress(address) {
    if (!ethers.utils.isAddress(address)) {
        throw new GraphQLError('invalid address');
    }
}

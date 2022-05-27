import {ethers} from "ethers";
import {UserInputError} from "apollo-server"

export function validateAddress(address) {
    if (!ethers.utils.isAddress(address)) {
        throw new UserInputError('invalid address');
    }
}

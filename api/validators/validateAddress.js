import {ethers} from "ethers"
import {ValidationError} from "apollo-server"

export function validateAddress(address) {
    if (!ethers.utils.isAddress(address)) {
        throw new ValidationError('invalid address')
    }
}

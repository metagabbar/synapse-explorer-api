import { GraphQLError } from 'graphql';
import { BRIDGE_TRANSACTIONS_COLLECTION } from "../db/index.js"
import {ethers} from "ethers";
import {validateChainId} from "../validators/validateChainId.js";
import {validateAddress} from "../validators/validateAddress.js";

export async function bridgeTransactionsCount({chainId, address}) {

    let filter = {}
    if (chainId || address) {
        filter = {'$and': []}
    }

    if (chainId) {
        validateChainId(chainId);

        filter['$and'].push({
            '$or': [
                {'fromChainId': chainId},
                {'toChainId': chainId},
            ]
        })
    }

    if (address) {
        validateAddress(address);

        if (!ethers.utils.isAddress(address)) {
            throw new GraphQLError('invalid address');
        }

        address = ethers.utils.getAddress(address)

        filter['$and'].push({
            '$or': [
                {'fromAddress': address},
                {'toAddress': address},
            ]
        })
    }

    let res = await BRIDGE_TRANSACTIONS_COLLECTION.countDocuments(filter);

    return res;
}

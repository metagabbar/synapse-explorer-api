import { BRIDGE_TRANSACTIONS_COLLECTION } from "../db/index.js"
import {queryAndCache} from "../db/utils.js"
import {ethers, BigNumber, FixedNumber} from "ethers"
import {getFormattedValue, getUSDPriceFromAddressOnChain} from "../utils/currencyUtils.js";
import {getAllTimeTotalForChains} from "../utils/analyticsAPIUtils.js";

export const CACHE_TTL = 3600

// TODO: FIX! Simply get count and total
export async function query(args) {
    // let {chainId, address} = args
    // let value = "0"

    // Generic mean for all/specific chain
    // if (!address) {
    //     let chainId = args.chainId ? args.chainId : 0
    //     let total = await getAllTimeTotalForChains(chainId)
    //     let txnCount = await getAllTimeTotalForChains(chainId);
    //     value = total;
    // } else {

        // // Filter for user address
        // let filter = {$and : []}
        // let addressFilter = {'$or' : [{ fromAddress: args.address}, { toAddress: args.address}]}
        // filter['$and'].push(addressFilter)
        //
        // // Further, filter for chain
        // if (args.chainId) {
        //     let chainIdFilter = {'$or' : [{ fromChainId: args.chainId}, { toChainId: args.chainId}]}
        //     filter['$and'].push(chainIdFilter)
        // }
        //
        //
        // let res = await BRIDGE_TRANSACTIONS_COLLECTION.find(filter)
        // let sum = FixedNumber.from("0")
        // for await (const txn of res) {
        //     let value = getFormattedValue(txn.sentTokenAddress, txn.fromChainId, txn.sentValue) // Adjust for decimals
        //     let usdPrice = await getUSDPriceFromAddressOnChain(txn.fromChainId, txn.sentTokenAddress) // Get trading price
        //     if (usdPrice) {
        //         sum = value.mulUnsafe(usdPrice).toString()
        //     }
        // }
    // }

    return {"value": "0"}
}

export async function bridgeTransactionsMeanValue(_, args) {
    let queryName = 'bridgeTransactionsMeanValue'
    let res = await queryAndCache(queryName, args, query, 1)
    return res
}

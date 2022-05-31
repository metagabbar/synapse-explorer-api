import { BRIDGE_TRANSACTIONS_COLLECTION } from "../db/index.js"
import {queryAndCache} from "../db/utils.js";
import {ethers} from "ethers";

async function dbQuery(args) {
    // Build filter
    let filter = {}
    if (Object.keys(args).length > 0) {
        filter = {$or : []}
    }

    if (args.chainId) {
        filter['$or'].push({ fromChainId: args.chainId})
        filter['$or'].push({ toChainId: args.chainId})
    }

    if (args.address) {
        filter['$or'].push({ fromAddress: args.address})
        filter['$or'].push({ toAddress: args.address})
    }

    // Find number of documents
    let docCount = await BRIDGE_TRANSACTIONS_COLLECTION.countDocuments(filter);
    let toSkip = docCount / 2;

    // Find median
    let res = await BRIDGE_TRANSACTIONS_COLLECTION
        .aggregate([
            {
                $match: filter
            }, {
                $sort: { sentValue: 1, kappa: 1}
            }, {
                $skip: toSkip
            }, {
                $limit: 1
            }, {
                $project : { sentValue : 1}
            },
        ], {
            allowDiskUse : true, // required for large sorts
            collation: {
                locale: "en_US",
                numericOrdering: true // sentValue is a string
            }
        }).toArray()

    // Format and return
    let medianInWei = res[0].sentValue
    let medianInEth = ethers.utils.formatEther(medianInWei)

    return {"value": medianInWei, "ETHValue": medianInEth}
}

export async function bridgeTransactionsMedianValue(_, args) {
    let queryName = 'bridgeTransactionsMedianValue'
    let res = await queryAndCache(queryName, args, dbQuery, 1)
    return res;
}

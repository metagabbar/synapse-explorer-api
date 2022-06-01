import { BRIDGE_TRANSACTIONS_COLLECTION } from "../db/index.js"
import { queryAndCache } from "../db/utils.js"

async function query({ source = "origin", hours = 24 }) {
  let date = new Date(Date.now() - hours * 60 * 60 * 1000)
  let unixTimestamp = parseInt((date.getTime() / 1000).toFixed(0))
  let direction
  let chainId

  if (source === "origin") {
    direction = "$sentTokenAddress"
    chainId = "$fromChainId"
  } else {
    direction = "$receivedTokenAddress"
    chainId = "$toChainId"
  }

  let aggregator = await BRIDGE_TRANSACTIONS_COLLECTION.aggregate([
    { $match: { receivedTime: { $gte: unixTimestamp } } },
    {
      $group: {
        _id: {
          tokenAddress: direction,
          chainId: chainId,
        },
        count: {
          $sum: 1,
        },
      },
    },
    { $sort: { count: -1 } },
  ]).toArray()

  return aggregator.map((entry) => {
    let {
      _id: { tokenAddress, chainId },
      count,
    } = entry

    return {
      tokenAddress,
      chainId,
      count,
    }
  })
}

export async function countByTokenAddress(_, args) {
  let queryName = "countByTokenAddress"
  let expireIn = 15
  let res = await queryAndCache(queryName, args, query, expireIn)

  return res
}

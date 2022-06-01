import { BRIDGE_TRANSACTIONS_COLLECTION } from "../db/index.js"
import { queryAndCache } from "../db/utils.js"

async function query({ source = "origin", hours = 24 }) {
  let date = new Date(Date.now() - hours * 60 * 60 * 1000)
  let unixTimestamp = parseInt((date.getTime() / 1000).toFixed(0))
  let direction

  if (source === "origin") {
    direction = "$fromChainId"
  } else {
    direction = "$toChainId"
  }

  let aggregator = await BRIDGE_TRANSACTIONS_COLLECTION.aggregate([
    { $match: { receivedTime: { $gte: unixTimestamp } } },
    { $group: { _id: direction, count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]).toArray()

  return aggregator.map((entry) => {
    let obj = {}
    obj["chainId"] = entry["_id"]
    obj["count"] = entry["count"]

    return obj
  })
}

export async function countByChainId(_, args) {
  let queryName = "countByChainId"
  let expireIn = 15
  let res = await queryAndCache(queryName, args, query, expireIn)

  return res
}

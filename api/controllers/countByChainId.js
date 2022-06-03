import { BRIDGE_TRANSACTIONS_COLLECTION } from '../db/index.js'
import { queryAndCache } from '../db/utils.js'

async function query({ chainId, address, direction, hours = 24 }) {
  let date = new Date(Date.now() - hours * 60 * 60 * 1000)
  let unixTimestamp = parseInt((date.getTime() / 1000).toFixed(0))
  let whereChainId

  if (direction === 'OUT') {
    whereChainId = '$fromChainId'
  } else {
    whereChainId = '$toChainId'
  }

  let matcher = {
    $match: {
      $and: [
        {
          receivedTime: { $gte: unixTimestamp },
        },
        {
          fromChainId: { $exists: true },
        },
      ],
    },
  }

  if (address) {
    matcher['$match']['$and'].push({
      fromAddress: { $eq: address },
    })
  }

  if (chainId) {
    matcher['$match']['$and'].push({
      fromChainId: { $eq: chainId },
    })
  }

  let aggregator = await BRIDGE_TRANSACTIONS_COLLECTION.aggregate([
    matcher,
    { $group: { _id: whereChainId, count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]).toArray()

  return aggregator.map((entry) => {
    let obj = {}
    obj['chainId'] = entry['_id']
    obj['count'] = entry['count']

    return obj
  })
}

export async function countByChainId(_, args) {
  let queryName = 'countByChainId'
  let expireIn = 15
  let res = await queryAndCache(queryName, args, query, expireIn)

  return res
}

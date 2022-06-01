import { BRIDGE_TRANSACTIONS_COLLECTION } from '../db/index.js'
import { queryAndCache } from '../db/utils.js'

async function query({ hours = 24 }) {
  let date = new Date(Date.now() - hours * 60 * 60 * 1000)
  let unixTimestamp = parseInt((date.getTime() / 1000).toFixed(0))

  let ranking = await BRIDGE_TRANSACTIONS_COLLECTION.aggregate([
    { $match: { sentTime: { $gte: unixTimestamp } } },
    { $group: { _id: '$fromAddress', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]).toArray()

  return ranking.map((entry) => {
    let { _id: address, count } = entry

    return {
      address,
      count,
    }
  })
}

export async function addressRanking(_, args) {
  let queryName = 'addressRanking'
  let expireIn = 15
  let res = await queryAndCache(queryName, args, query, expireIn)

  return res
}

import { BRIDGE_TRANSACTIONS_COLLECTION } from '../db/index.js'
import { queryAndCache } from '../db/queryAndCache.js'

async function query({ type, chainId, days = 30 }) {
  const past_x_days = days * 86400000

  let matchFilter = {
    $match: {
      $expr: {
        $gt: [
          { $toDate: '$_id' },
          { $toDate: { $subtract: [new Date(), past_x_days] } },
        ],
      },
    },
  }

  let sorter = {
    $sort: { '_id.dateYMD': 1 },
  }

  let groupFilter = {
    $group: {
      _id: {
        dateYMD: {
          $dateFromParts: {
            year: { $year: '$_id' },
            month: { $month: '$_id' },
            day: { $dayOfMonth: '$_id' },
          },
        },
      },
    },
  }

  let project = {
    $project: {
      _id: 0,
      date: {
        $dateToString: { date: '$_id.dateYMD', format: '%d-%m-%Y' },
      },
    },
  }

  if (type === 'BRIDGEVOLUME') {
    groupFilter['$group']['total'] = { $sum: '$sentValueUSD' }
    project['$project']['total'] = 1
  } else if (type === 'TRANSACTIONS') {
    groupFilter['$group']['total'] = { $sum: 1 }
    project['$project']['total'] = 1
  } else if (type === 'ADDRESSES') {
    groupFilter['$group']['uniqueAddresses'] = { $addToSet: '$fromAddress' }
    project['$project']['total'] = { $size: '$uniqueAddresses' }
  }

  if (chainId) {
    matchFilter['$match']['$or'] = [
      { fromChainId: { $eq: chainId } },
      { toChainId: { $eq: chainId } },
    ]
  }

  let query = await BRIDGE_TRANSACTIONS_COLLECTION.aggregate([
    matchFilter,
    groupFilter,
    sorter,
    project,
  ]).toArray()

  let dateResults = query.map((entry) => {
    return {
      date: entry.date,
      total: +entry.total.toString(),
    }
  })

  let total = dateResults.reduce((accumulator, object) => {
    return accumulator + object.total
  }, 0)

  return {
    type,
    total,
    dateResults,
  }
}

export async function historicalStatistics(_, args) {
  let queryName = 'historicalStatistics'
  let expireIn = 3600
  let res = await queryAndCache(queryName, args, query, expireIn)

  return res
}

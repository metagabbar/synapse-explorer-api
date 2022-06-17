import { ethers } from 'ethers'
import AWS from 'aws-sdk'
import { v4 as uuidv4 } from 'uuid'
import { Parser } from 'json2csv'

import { getFormattedValue } from '../models/bridgeTransaction.js'
import { BRIDGE_TRANSACTIONS_COLLECTION } from '../db/index.js'
import { validateAddress } from '../validators/validateAddress.js'

// TODO: Refresh these keys and move over to .env config
// once we can update config on CI 

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  accessKeyId: '5616B5A2FC38D0416275',
  secretAccessKey: '31V3nBnOdkcIKTnLrEhtv4gWiidQrkFk8RrV2SqT',
  endpoint: 'https://s3.filebase.com',
  region: 'us-east-1',
  s3ForcePathStyle: true,
})


// TODO: Are these the right fields we want to be returning?

const fields = [
  'fromTxnHash',
  'toTxnHash',
  'toAddress',
  'fromAddress',
  'sentValue',
  'receivedValue',
  'formattedSentValue',
  'formattedReceivedValue',
  'fromChainId',
  'toChainId',
  'sentTime',
  'receivedTime',
  'sentTokenAddress',
  'receivedTokenAddress',
  'kappa',
  'pending',
]

function addFormattedValues(txn) {
  let formattedReceivedValue = getFormattedValue(
    txn.receivedTokenAddress,
    txn.toChainId,
    txn.receivedValue
  )

  let formattedSentValue = getFormattedValue(
    txn.sentTokenAddress,
    txn.fromChainId,
    txn.sentValue
  )

  return {
    ...txn,
    formattedSentValue,
    formattedReceivedValue,
  }
}

async function getTransactions({ address }) {
  let filter = {
    $or: [
      {
        fromAddress: address,
      },
      {
        toAddress: address,
      },
    ],
  }

  let transactions = await BRIDGE_TRANSACTIONS_COLLECTION.find(filter)
    .sort({
      sentTime: -1,
    })
    .toArray()

  transactions = transactions.map((txn) => addFormattedValues(txn))

  return transactions
}

async function generateCsvString({ address }) {
  const transactions = await getTransactions({ address })

  const json2csv = new Parser({ fields })

  const csv = json2csv.parse(transactions)

  return await csv
}

async function uploadData({ address }) {
  let res = await generateCsvString({ address })

  const uuid = uuidv4()
  const filename = `${uuid}.csv`

  const params = {
    Bucket: 'csvs',
    Key: filename,
    ContentType: 'text/csv',
    Body: res,
    ACL: 'public-read',
  }

  await s3.putObject(params).promise()

  const data = await s3
    .getObject({
      Bucket: 'csvs',
      Key: filename,
    })
    .promise()

  return data.Metadata.cid
}

export async function getCsv(_, args) {
  if (args.address) {
    validateAddress(args.address)
    args.address = ethers.utils.getAddress(args.address)
  }

  const cid = await uploadData(args)

  return {
    cid,
    ipfsGatewayUrl: `https://ipfs.filebase.io/ipfs/${cid}`,
  }
}

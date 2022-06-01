import 'dotenv/config'
import { BRIDGE_TRANSACTIONS_COLLECTION } from "../api/db/index.js"
import {BigNumber, ethers} from "ethers"

async function query(args) {
    let res = await BRIDGE_TRANSACTIONS_COLLECTION.aggregate([
        // {$match: {kappa: "0xd82af4f2b65b58432e2826a1addee96fab2952b6564a2633d344793d83c42364"}},
        {$project : {"sentValue" : 1}}
    ])

    let cnt = 0
    for await (const txn of res) {
        if (txn.sentValue) {
            sum = sum.add(BigNumber.from(txn.sentValue))
            cnt += 1
        }
    }
    console.log(ethers.utils.formatEther(sum.toString()))
    console.log(cnt)

    return {"value": 1, "ETHValue": 1}
}

setTimeout(() => {  query({})}, 1000)

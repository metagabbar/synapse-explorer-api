import {totalBridgeAmount} from "../../controllers/totalBridgeAmount.js";
import {countBridgeTransactions} from "../../controllers/countBridgeTransactions.js";
import {FixedNumber} from "ethers";

/***
 * Returns MEAN from args
 * @param args
 * @return {Promise<{USDValue: string}>}
 */
export async function meanQuery(args) {
    let totalVal = await totalBridgeAmount(null, args)
    let cntVal = await countBridgeTransactions(null, args)

    // Avoid div by 0
    let mean = "0"
    if (totalVal.value && cntVal?.value.toString() !== "0") {
        mean = FixedNumber.from(totalVal.value.toString()).divUnsafe(FixedNumber.from(cntVal.value.toString()))
    }

    return {"USDValue": mean.toString()}
}

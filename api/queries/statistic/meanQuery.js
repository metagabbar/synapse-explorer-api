import {totalQuery} from "./totalQuery.js";
import {countQuery} from "./countQuery.js";
import {FixedNumber} from "ethers";

/***
 * Returns MEAN from args
 * @param args
 * @return {Promise<{USDValue: string}>}
 */
export async function meanQuery(args) {
    let totalVal = await totalQuery(args)
    let cntVal = await countQuery(args)

    // Avoid div by 0
    let mean = "0"
    if (totalVal.USDValue && cntVal?.USDValue.toString() !== "0") {
        mean = FixedNumber.from(totalVal.USDValue.toString()).divUnsafe(FixedNumber.from(cntVal.USDValue.toString()))
    }

    return {"USDValue": mean.toString()}
}

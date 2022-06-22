import {FixedNumber} from "ethers";
import {
    getDivisorForDecimals,
    getDecimalsForChainFromTokenAddress,
    getTokenSymbolFromAddress
} from "../utils/sdkUtils.js"

/**
 * Returns formatted value for a token on a chain
 *
 * @param tokenAddress
 * @param chainId
 * @param value
 * @return {number|null}
 */
// TODO: remove once all txns backindexed with values in indexer
export function getFormattedValue(tokenAddress, chainId, value) {
    try {
        if (!value) {
            return null
        }
        let bigValue = FixedNumber.from(value.toString())
        let decimals = getDecimalsForChainFromTokenAddress(chainId, tokenAddress)
        let bigDivisor = FixedNumber.from(getDivisorForDecimals(decimals).toString())
        let res = bigValue.divUnsafe(bigDivisor)
        let floatVal = res.toUnsafeFloat()
        if (Number.isFinite(floatVal)) {
            return floatVal
        }
        throw new Error(`$Unable to parse float for value ${value}`)
    } catch (err) {
        console.error(err)
    }
    return null
}

export function formatBridgeTransaction(args) {
    const fromInfo = {
        chainId: args.fromChainId,
        address: args.fromAddress?.trim() ?? args.fromAddress,
        txnHash: args.fromTxnHash ? args.fromTxnHash.trim() : args.fromTxnHash,
        tokenAddress: args.sentTokenAddress ? args.sentTokenAddress.trim() : args.sentTokenAddress,
        tokenSymbol: getTokenSymbolFromAddress(args.fromChainId, args.sentTokenAddress),
        time: args.sentTime,

        value: args.sentValue,
        formattedValue: args.sentValueFormatted ? args.sentValueFormatted : getFormattedValue(args.sentTokenAddress, args.fromChainId, args.sentValue),
        USDValue: args.USDValue
    }
    const toInfo = {
        chainId: args.toChainId,
        address: args.toAddress ? args.toAddress.trim() : args.toAddress,
        txnHash: args.toTxnHash ? args.toTxnHash.trim() : args.toTxnHash,
        tokenAddress: args.receivedTokenAddress ? args.receivedTokenAddress.trim() : args.receivedTokenAddress,
        tokenSymbol: getTokenSymbolFromAddress(args.toChainId, args.receivedTokenAddress),
        time: args.receivedTime,

        value: args.receivedValue,
        formattedValue: args.receivedValueFormatted ? args.receivedValueFormatted : getFormattedValue(args.receivedTokenAddress, args.toChainId, args.receivedValue),
        USDValue: args.USDValue
    }

    return {
        fromInfo,
        toInfo,
        kappa: args.kappa ? args.kappa.trim() : args.kappa,
        pending: args.pending,
        swapSuccess: args.swapSuccess,
    }
}

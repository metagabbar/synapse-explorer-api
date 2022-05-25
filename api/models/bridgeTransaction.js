import {bignumber, divide} from "mathjs";
import {
    getDivisorForDecimals,
    getDecimalsForChainFromTokenAddress,
    getTokenSymbolFromAddress
} from "../utils/sdkUtils.js";

function getFormattedValue(tokenAddress, chainId, value) {
    try {
        if (!value) {
            return null;
        }
        let decimals = getDecimalsForChainFromTokenAddress(chainId, tokenAddress);
        let res = divide(bignumber(value), getDivisorForDecimals(decimals));
        return res.toString();
    } catch (err) {
        console.error(err);
    }
    return null;
}

export function formatBridgeTransaction(args) {
    const fromInfo = {
        chainId: args.fromChainId,
        address: args.fromAddress?.trim() ?? args.fromAddress,
        txnHash: args.fromTxnHash ? args.fromTxnHash.trim() : args.fromTxnHash,
        tokenAddress: args.sentTokenAddress ? args.sentTokenAddress.trim() : args.sentTokenAddress,
        tokenSymbol:  args.sentTokenSymbol ? args.sentTokenSymbol : getTokenSymbolFromAddress(args.fromChainId, args.sentTokenAddress),
        time:         args.sentTime,

        value:        args.sentValue,
        formattedValue: getFormattedValue(args.sentTokenAddress, args.fromChainId, args.sentValue),
    }
    const toInfo = {
        chainId: args.toChainId,
        address: args.toAddress ? args.toAddress.trim() : args.toAddress,
        txnHash: args.toTxnHash ? args.toTxnHash.trim() : args.toTxnHash,
        tokenAddress: args.receivedTokenAddress ? args.receivedTokenAddress.trim(): args.receivedTokenAddress,
        tokenSymbol:  args.receivedTokenSymbol ? args.receivedTokenSymbol : getTokenSymbolFromAddress(args.toChainId, args.receivedTokenAddress),
        time:         args.receivedTime,

        value:        args.receivedValue,
        formattedValue: getFormattedValue(args.receivedTokenAddress, args.toChainId, args.receivedValue),
    }

    return {
        fromInfo,
        toInfo,
        kappa: args.kappa ? args.kappa.trim() : args.kappa,
        pending: args.pending,
        swapSuccess: args.swapSuccess,
    }
}

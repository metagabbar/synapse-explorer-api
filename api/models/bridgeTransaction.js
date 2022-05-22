

export function formatBridgeTransaction(args) {
    const fromInfo = {
        chainId: args.fromChainId,
        address: args.fromAddress?.trim() ?? args.fromAddress,
        txnHash: args.fromTxnHash ? args.fromTxnHash.trim() : args.fromTxnHash,

        value:        args.sentValue,
        valueUSD:     undefined,
        tokenAddress: args.sentTokenAddress ? args.sentTokenAddress.trim() : args.sentTokenAddress,
        // ?? getTokenSymbolFromAddress(args.fromChainId, sentTokenAddress),
        tokenSymbol:  args.sentTokenSymbol,
        time:         args.sentTime,
    }
    const toInfo = {
        chainId: args.toChainId,
        address: args.toAddress ? args.toAddress.trim() : args.toAddress,
        txnHash: args.toTxnHash ? args.toTxnHash.trim() : args.toTxnHash,

        value:        args.receivedValue,
        valueUSD:     undefined,
        // ?? getTokenSymbolFromAddress(args.toChainId, args.receivedTokenAddress),
        tokenAddress: args.receivedTokenAddress ? args.receivedTokenAddress.trim(): args.receivedTokenAddress,
        tokenSymbol:  args.receivedTokenSymbol,
        time:         args.receivedTime,
    }

    return {
        fromInfo,
        toInfo,
        kappa: args.kappa ? args.kappa.trim() : args.kappa,
        pending: args.pending,
        swapSuccess: args.swapSuccess,
    }
}

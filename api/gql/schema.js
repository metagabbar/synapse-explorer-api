import {buildSchema} from "graphql";

export const schema = buildSchema(`
  type BridgeTransaction {
    chainIdFrom: Int,
    addressFrom: String,
    txnFromHash: String,
    
    chainIdTo: Int,
    addressTo: String,
    txnToHash: String,

    sentValue: String,
    sentValueUSD: Float,
    sentTokenAddress: String,
    sentTokenSymbol: String,
    sentTime: Int,
    
    receivedValue: String,
    receivedValueUSD: Float,
    receivedTokenAddress: String,
    receivedTokenSymbol: String,
    receivedTime: Int,
    
    kappa: String
    pending: Boolean
    swapSuccess: Boolean
  }
  
  type Query {
    getBridgeTransactions(
        chainId: Int,
        address: String,
        txnHash: String,
        kappa: String
    ): [BridgeTransaction]
    
    latestBridgeTransactions(
        includePending: Boolean
    ): [BridgeTransaction]
  }
`);

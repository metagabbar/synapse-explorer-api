import {buildSchema} from "graphql";

export const schema = buildSchema(`
  type Transaction {
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
    sentTime: String,
    
    receivedValue: String,
    receivedValueUSD: Float,
    receivedTokenAddress: String,
    receivedTokenSymbol: String,
    receivedTime: String,
    
    kappa: String
    pending: Boolean
    swapSuccess: Boolean
  }
  
  type Query {
    getTransactions(
        chainFrom: Int,
        chainTo: Int,
        addressFrom: String,
        addressTo: String,
        txnToHash: String,
        txnFromHash: String,
        kappa: String
    ): [Transaction]
  }
`);

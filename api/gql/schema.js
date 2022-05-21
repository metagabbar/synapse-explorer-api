import {buildSchema} from "graphql";

export const schema = buildSchema(/* GraphQL */  `
  type BridgeTransaction {
    # fromInfo: PartialInfo
    # toInfo: PartialInfo
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

  type PartialInfo {
    chainId: Int,
    address: String,
    txnHash: String,

    value:        String,
    valueUSD:     Float,
    tokenAddress: String,
    tokenSymbol:  String,
    time:         Int,
  }

  type Query {
    getBridgeTransactions(
        chainId: Int,
        address: String,
        txnHash: String,
        kappa: String
    ): [BridgeTransaction]

    latestBridgeTransactions: [BridgeTransaction]
  }
`);

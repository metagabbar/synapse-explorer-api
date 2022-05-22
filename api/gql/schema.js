import {buildSchema} from "graphql";

export const schema = buildSchema(`
  type BridgeTransaction {
    fromInfo: PartialInfo
    toInfo: PartialInfo

    kappa:       String
    pending:     Boolean
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

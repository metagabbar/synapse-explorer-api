import {buildSchema} from "graphql"

export const schema = buildSchema( /* GraphQL */  `
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
    
    """
    Returns bridged transactions filterable by chain, to/from address, to/from txn hash and keccak hash
    """
    bridgeTransactions(
        chainId: Int,
        address: String,
        txnHash: String,
        kappa: String
    ): [BridgeTransaction]

    """
    Returns the latest bridged transactions across all chains
    """
    latestBridgeTransactions: [BridgeTransaction]

    """
    Returns number of transactions bridged filterable by chain and user.
    Specifying no parameter returns the result across all transactions.
    """
    bridgeTransactionsCount(
      chainId: Int,
      address: String,
    ): String

    """
    Returns the median value of bridged transactions by chain and user.
    Specifying no parameter returns the result across all transactions.
    """
    bridgeTransactionsMedianValue(
      chainId: Int,
      address: String,
    ): String

    """
    Returns the mean value of bridged transactions by chain and user.
    Specifying no parameter returns the result across all transactions.
    """
    bridgeTransactionsMeanValue(
      chainId: Int,
      address: String,
    ): String

    """
    Returns the total value of bridged transactions by chain and user.
    Specifying no parameter returns the result across all transactions.
    """
    bridgeTransactionsTotalValue(
      chainId: Int,
      txnHash: String,
    ): String

  }
`)

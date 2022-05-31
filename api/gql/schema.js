import {gql} from "apollo-server"

export const schema = gql`
  type BridgeTransaction {
    fromInfo: PartialInfo
    toInfo:   PartialInfo

    kappa:       String
    pending:     Boolean
    swapSuccess: Boolean
  }

  type PartialInfo {
    chainId: Int,
    address: String,
    txnHash: String,

    value:          String,
    formattedValue: String,
    tokenAddress:   String,
    tokenSymbol:    String,
    time:           Int,
  }
  
  type ScalarResult {
    value: String
    ETHValue: String
  }

  type TransactionCountResult {
    chainId: Int
    count: Int
  }

  type TokenCountResult {
    chainId: Int
    tokenAddress: String
    count: Int
  }

  type AddressRanking {
    address: String
    count: Int
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
        page: Int=1
    ): [BridgeTransaction]

    """
    Returns the latest bridged transactions across all chains
    """
    latestBridgeTransactions(
      includePending: Boolean=true,
      page: Int=1
    ): [BridgeTransaction]

    """
    Returns number of transactions bridged filterable by chain and user.
    Specifying no parameter returns the result across all transactions.
    """
    bridgeTransactionsCount(
      chainId: Int,
      address: String,
    ): ScalarResult

    """
    Returns the median value of bridged transactions by chain and user in wei.
    Specifying no parameter returns the result across all transactions.
    """
    bridgeTransactionsMedianValue(
      chainId: Int,
      address: String,
    ): ScalarResult

    """
    Returns the mean value of bridged transactions by chain and user in wei.
    Specifying no parameter returns the result across all transactions.
    """
    bridgeTransactionsMeanValue(
      chainId: Int,
      address: String,
    ): ScalarResult

    """
    Returns the total value of bridged transactions by chain and user.
    Specifying no parameter returns the result across all transactions.
    """
    bridgeTransactionsTotalValue(
      chainId: Int,
      txnHash: String,
    ): ScalarResult

    """
    Returns counts of chain transactions by source and time. 
    Specifying no parameters defaults to origin and 24 hours.
    """
    countByChainId(
      source: String="origin",
      hours: Int=24,
    ): [TransactionCountResult]
    
    """
    Returns counts of token addresses source and time. 
    Specifying no parameters defaults to origin and 24 hours.
    """
    countByTokenAddress(
      source: String="origin",
      hours: Int=24,
    ): [TokenCountResult]
  
    """
    Returns addresses and transaction count (origin) over time.
    Specifying no parameters defaults to 24 hours.
    """
    addressRanking(
      hours: Int=24
    ): [AddressRanking]
  }
`;

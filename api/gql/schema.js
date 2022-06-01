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
  
  enum Duration {
    PAST_DAY
    ALL_TIME
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
    Returns count of transactions bridged for a given duration.
    Specifying no chainId returns the result across all transactions.
    """
    bridgeTransactionsCount(
      duration: Duration!,
      chainId: Int,
      address: String,
    ): ScalarResult

    """
    Returns the total value of bridged transactions in USD by chain.
    Specifying no parameter returns the result across all transactions.
    """
    bridgeTransactionsTotalValue(
      duration: Duration!,
      chainId: Int,
    ): ScalarResult

    """
    Returns the total value of bridged transactions for a chain id and given duration.
    Specifying no parameter returns the result across all transactions.
    """
    bridgeTransactionsMedianValue(
      duration: Duration!,
      chainId: Int,
    ): ScalarResult

    """
    Returns mean value of transactions bridged for a given duration.
    Specifying no parameter returns the result across all transactions.
    """
    bridgeTransactionsMeanValue(
      duration: Duration!,
      chainId: Int,
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
`

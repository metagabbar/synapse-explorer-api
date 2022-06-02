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
  
  enum Direction {
    IN
    OUT
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
    Returns count of transactions bridged for a given duration, chain and address.
    Specifying no duration defaults to ALL_TIME
    """
    countBridgeTransactions(
      duration: Duration=ALL_TIME,
      chainId: Int,
      address: String,
    ): ScalarResult

    """
    Returns the TOTAL value of bridged transactions in USD for a given duration, chain and address.
    Specifying no duration defaults to ALL_TIME
    """
    totalBridgeAmount(
      duration: Duration=ALL_TIME,
      chainId: Int,
      address: String,
    ): ScalarResult

    """
    Returns the MEDIAN value of bridged transactions in USD for a given duration, chain and address.
    Specifying no duration defaults to ALL_TIME
    """
    medianBridgeAmount(
      duration: Duration=ALL_TIME,
      chainId: Int,
      address: String,
    ): ScalarResult

    """
    Returns the MEAN value of bridged transactions in USD for a given duration, chain and address.
    Specifying no duration defaults to ALL_TIME
    """
    meanBridgeAmount(
      duration: Duration=ALL_TIME,
      chainId: Int,
      address: String,
    ): ScalarResult

    """
    Returns the COUNT of bridged transactions for a given duration, chain and address.
    Specifying no duration defaults to ALL_TIME
    """
    countByChainId(
      address: String,
      direction: Direction=IN,
      hours: Int=24,
    ): [TransactionCountResult]
    
    """
    Returns counts of token addresses source and time. 
    Specifying no parameters defaults to origin and 24 hours.
    """
    countByTokenAddress(
      address: String,
      direction: Direction=IN,
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
import { toDays } from '../utils/timeUtils.js'

/**
 * Returns transaction status
 *
 * complete: an indexed transaction, not pending
 * indexing: unindexed transaction, not pending
 * pending: unindexed transaction, pending
 * incomplete: unindex transaction, has been pending too long
 *
 * @param {Object} fromInfo
 * @param {Object} toInfo
 * @param {Boolean} pending
 * @return {string|null}
 */
export function getStatus(fromInfo, toInfo, pending) {
  if (!pending && isIndexed(fromInfo, toInfo)) {
    return 'complete'
  } else if (
    pending &&
    !isIndexed(fromInfo, toInfo) &&
    !isRecent(fromInfo, toInfo)
  ) {
    return 'incomplete'
  } else if (
    pending &&
    !isIndexed(fromInfo, toInfo) &&
    isRecent(fromInfo, toInfo)
  ) {
    return 'pending'
  } else if (
    !pending &&
    !isIndexed(fromInfo, toInfo) &&
    isRecent(fromInfo, toInfo)
  ) {
    return 'indexing'
  }
}

/**
 * Returns state of indexing
 *
 * A transaction is indexed if both sides fromInfo and toInfo are present
 * It's unindexed if only one side is present
 *
 * @param {Object} fromInfo
 * @param {Object} toInfo
 * @return {boolean}
 */
export function isIndexed(fromInfo, toInfo) {
  return fromInfo.chainId &&
    fromInfo.address &&
    fromInfo.txnHash &&
    toInfo.chainId &&
    toInfo.address &&
    toInfo.txnHash
    ? true
    : false
}

/**
 * We consider a transaction to be recent if within a specific transaction day cutoff
 *
 * @param {Object} fromInfo
 * @param {Object} toInfo
 * @return {boolean}
 */
export function isRecent(fromInfo, toInfo) {
  const TRANSACTION_DAY_CUTOFF = 10
  const now = +new Date()

  if (fromInfo.time) {
    return toDays(now - fromInfo.time * 1000) < TRANSACTION_DAY_CUTOFF
  } else if (toInfo.time) {
    return toDays(now - toInfo.time * 1000) < TRANSACTION_DAY_CUTOFF
  }
}

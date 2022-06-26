import { expect } from 'chai'
import { getStatus, isIndexed, isRecent } from '../api/utils/statusUtils.js'
import { transactionFactory } from './factories/transactionFactory.js'

describe('status utilities tests', () => {
  describe('getStatus', () => {
    it('handles complete transaction', () => {
      const txn = transactionFactory({
        pending: false,
        recent: true,
        hasFromInfo: true,
        hasToInfo: true,
      })

      expect(getStatus(txn.fromInfo, txn.toInfo, txn.pending)).to.equal(
        'complete'
      )
    })

    it('handles incomplete transaction', () => {
      const txn = transactionFactory({
        pending: true,
        recent: false,
        hasFromInfo: false,
        hasToInfo: true,
      })

      expect(getStatus(txn.fromInfo, txn.toInfo, txn.pending)).to.equal(
        'incomplete'
      )
    })

    it('handles pending transaction', () => {
      const txn = transactionFactory({
        pending: true,
        recent: true,
        hasFromInfo: false,
        hasToInfo: true,
      })

      expect(getStatus(txn.fromInfo, txn.toInfo, txn.pending)).to.equal(
        'pending'
      )
    })

    it('handles indexing transaction', () => {
      const txn = transactionFactory({
        pending: false,
        recent: true,
        hasFromInfo: false,
        hasToInfo: true,
      })

      expect(getStatus(txn.fromInfo, txn.toInfo, txn.pending)).to.equal(
        'indexing'
      )
    })
  })

  describe('isIndexed', () => {
    it('handles full data', () => {
      const txn = transactionFactory({ hasFromInfo: true, hasToInfo: true })

      expect(isIndexed(txn.fromInfo, txn.toInfo)).to.eq(true)
    })

    it('handles missing data', () => {
      const txn = transactionFactory({ hasFromInfo: false, hasToInfo: true })

      expect(isIndexed(txn.fromInfo, txn.toInfo)).to.eq(false)
    })
  })

  describe('isRecent', () => {
    it('handles recent transactions', () => {
      const txn = transactionFactory({
        hasFromInfo: true,
        hasToInfo: true,
        recent: true,
      })

      expect(isRecent(txn.fromInfo, txn.toInfo)).to.equal(true)
    })

    it('handles old transactions', () => {
      const txn = transactionFactory({
        hasFromInfo: true,
        hasToInfo: true,
        recent: false,
      })

      expect(isRecent(txn.fromInfo, txn.toInfo)).to.equal(false)
    })
  })
})

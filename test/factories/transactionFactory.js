import ethers from 'ethers'
import crypto from 'crypto'

/**
 * Generates a mock transaction for use in tests
 *
 * @param {Boolean} hasFromInfo
 * @param {Boolean} hasToInfo
 * @param {Boolean} pending
 * @param {Boolean} recent
 * @return {object}
 */
export function transactionFactory({
  hasFromInfo,
  hasToInfo,
  pending = false,
  recent = false,
}) {
  const now = +new Date() / 1000
  const day = 60 * 60 * 24
  const time = recent ? now - 1 * day : now - 20 * day

  const kappa = `0x${crypto.randomBytes(32).toString('hex')}`
  const address = ethers.Wallet.createRandom().address
  const fromTxnHash = `0x${crypto.randomBytes(32).toString('hex')}`
  const toTxnHash = `0x${crypto.randomBytes(32).toString('hex')}`
  const fromTokenAddress = ethers.Wallet.createRandom().address
  const toTokenAddress = ethers.Wallet.createRandom().address

  const fromInfo = {
    chainId: hasFromInfo ? 1 : null,
    address: hasFromInfo ? address : null,
    txnHash: hasFromInfo ? fromTxnHash : null,
    tokenAddress: hasFromInfo ? fromTokenAddress : null,
    tokenSymbol: hasFromInfo ? 'aUSD' : null,
    time,
    value: hasFromInfo ? '2000000000000000000000' : null,
    formattedValue: hasFromInfo ? 2000.0 : null,
    USDValue: hasFromInfo ? 2000.0 : null,
  }

  const toInfo = {
    chainId: hasToInfo ? 10 : null,
    address: hasToInfo ? address : null,
    txnHash: hasToInfo ? toTxnHash : null,
    tokenAddress: hasToInfo ? toTokenAddress : null,
    tokenSymbol: hasToInfo ? 'bUSD' : null,
    time: time + 1,
    value: hasToInfo ? '1999000000000000000000' : null,
    formattedValue: hasToInfo ? 1999.0 : null,
    USDValue: hasToInfo ? 1999.0 : null,
  }

  let transaction = {
    pending,
    kappa,
    fromInfo,
    toInfo,
  }

  return transaction
}

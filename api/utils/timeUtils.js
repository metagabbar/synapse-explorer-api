/**
 * Returns a unix timestamp representing the past 24 hours
 *
 * @return {number}
 */
export function getTimestampForPast24Hours() {
  let date = new Date(Date.now() - 24 * 60 * 60 * 1000)
  let unixTimestamp = parseInt((date.getTime() / 1000).toFixed(0))
  return unixTimestamp
}

/**
 * Returns a unix timestamp representing the date and time at which the function is called
 *
 * @return {number}
 */
export function getCurrentTimestamp() {
  let date = new Date(Date.now())
  let unixTimestamp = parseInt((date.getTime() / 1000).toFixed(0))
  return unixTimestamp
}

/**
 * Given a unix timestamp, this returns the number of days that timestamp represents
 *
 * @param {Number} unixTimestamp
 * @return {number}
 */
export function toDays(unixTimestamp) {
  return unixTimestamp / 1000 / 3600 / 24
}

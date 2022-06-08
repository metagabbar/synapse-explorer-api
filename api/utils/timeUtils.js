export function getTimestampForPast24Hours() {
    let date = new Date(Date.now() - (24 * 60 * 60 * 1000))
    let unixTimestamp = parseInt((date.getTime() / 1000).toFixed(0))
    return unixTimestamp
}

export function getCurrentTimestamp() {
    let date = new Date(Date.now())
    let unixTimestamp = parseInt((date.getTime() / 1000).toFixed(0))
    return unixTimestamp
}

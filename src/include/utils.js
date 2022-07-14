export function dateFromFiletime(date) {
    if (!date) {
        return console.log("No date provided for dateFromFiletime")
    }
    if (date == 0)
        return date
    var result = new Date(date/1e4 - 1.16444736e13)
    return result;
}

export function dateLdapToString(date) {
    if (!date) {
        return console.log("No date provided for dateFromFiletime")
    }
    if (date.slice(-1).toUpperCase() != 'Z') {
        console.log(date)
        console.log("Invalid timezone, must be Timezone Z (Zulu Time Zone, UTC/GMT)")
    }
    var dateString = date.toString()
    var year = dateString.substring(0,4)
    var month = dateString.substring(4,6)
    var day = dateString.substring(6,8)
    var hour = dateString.substring(8,10)
    var min = dateString.substring(10,12)
    var sec = dateString.substring(12,14)
    var result = year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec
    return result
}
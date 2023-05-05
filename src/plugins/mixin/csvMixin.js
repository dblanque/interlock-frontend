// INTERLOCK IS LICENSED UNDER GNU AGPLv3
// ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L.
// File: csvMixin.js

const csvMixin = {
    methods:{
    // Methods Start
    csvToJSON(csv, delimiter) {
        csv = csv.replace(/\r\n/g, '\n'); // Replaces windows new line to linux.
        var lines = csv.split('\n')
        var result = []
        var headers = lines[0].split(delimiter)
        var last_line = lines.slice(-1)[0]

        if (last_line.length > 1)
            return false

        for (var i = 1; i < lines.length - 1; i++) {
            var obj = {}
            var currentline = lines[i].split(delimiter)

            // Loop for each column in the line
            for (var j = 0; j < headers.length; j++) {
                obj[headers[j]] = currentline[j]
            }

            result.push(obj)
        }
        return result
    },
    // Methods End
    }
}

export default csvMixin;
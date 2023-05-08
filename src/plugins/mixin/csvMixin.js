// INTERLOCK IS LICENSED UNDER GNU AGPLv3
// ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L.
// File: csvMixin.js

const csvMixin = {
    methods:{
    // Methods Start
    getUserImportHeaders() {
        return ["username","password","email","first_name","last_name","initials","webpage"]
    },

    csvToJSON(csv, delimiter) {
        csv = csv.replace(/\r\n/g, '\n'); // Replaces windows new line to linux.
        var lines = csv.split('\n')
        var result = []
        var headers = lines[0].split(delimiter)
        var last_line = lines.slice(-1)[0]

        for (let i = 0; i < headers.length; i++) {
            if (headers[i].length < 1)
                return "ERR_INVALID_CSV_HEADERS"
        }

        if (last_line.length > 1)
            return false

        for (var i = 1; i < lines.length - 1; i++) {
            var obj = {}
            var empty_line = true
            var currentline = lines[i].split(delimiter)

            // Loop for each column in the line
            for (var j = 0; j < headers.length; j++) {
                obj[headers[j]] = currentline[j]
            }

            for (const k in obj) {
                if (obj[k].length > 0)
                    empty_line = false
            }

            if (!empty_line)
                result.push(obj)
        }
        return { headers: headers, data: result }
    },
    // Methods End
    }
}

export default csvMixin;
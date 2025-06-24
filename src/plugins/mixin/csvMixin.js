// INTERLOCK IS LICENSED UNDER GNU AGPLv3
// ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L.
// File: csvMixin.js

const csvMixin = {
	methods: {
		csvToJSON(csv, delimiter) {
			csv = csv.replace(/\r\n/g, '\n'); // Replaces windows new line to linux.
			let lines = csv.split('\n')
			let result = []
			let resultObjects = []
			let headers = lines[0].split(delimiter)
			let last_line = lines.slice(-1)[0]

			for (let i = 0; i < headers.length; i++) {
				if (headers[i].length < 1)
					return "ERR_INVALID_CSV_HEADERS"
			}

			if (last_line.length > 1)
				return false

			for (let i = 1; i < lines.length - 1; i++) {
				// For imports
				let row = []
				// For data tables
				let previewRow = {}
				let emptyLine = true
				let currentLine = lines[i].split(delimiter)

				// Loop for each column in the line
				for (let j = 0; j < headers.length; j++) {
					const _v = currentLine[j]
					previewRow[headers[j]] = _v
					row.push(_v)
				}

				for (const col of row) {
					if (col.length > 0)
						emptyLine = false
					break
				}

				if (!emptyLine) {
					result.push(row)
					resultObjects.push(previewRow)
				}
			}
			return { headers: headers, data: result, preview_data: resultObjects }
		},
		// Methods End
	}
}

export default csvMixin;
export default
    class CSV {

    static CELL_DIVIDER = '\t';
    static LINE_DIVIDER = '\n';

    static exportNoHeaders(rows, title) {
        var exported = []
        for (var x = 0; x < rows.length; x++) {
            var row = "";
            for (var y = 0; y < rows[x].length; y++) {
                if (y < (rows[x].length - 1)) {
                    row += rows[x][y] + this.CELL_DIVIDER
                } else {
                    row += rows[x][y] + this.LINE_DIVIDER
                }
            }
            exported.push(row);
        }
        var csv = new Blob(exported, { type: "text/csv" });
        var downloadLink = document.createElement("a");
        downloadLink.download = title + '.csv';
        downloadLink.href = window.URL.createObjectURL(csv);
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.click();
    }

    static export(headers, rows, title) {
        var exported = []
        for (var i = 0; i < headers.length; i++) {
            var header = "";
            if (i < (headers.length - 1))
                header += headers[i] + this.CELL_DIVIDER
            else header += headers[i] + this.LINE_DIVIDER
            exported.push(header);
        }
        for (var x = 0; x < rows.length; x++) {
            var row = "";
            for (var y = 0; y < rows[x].length; y++) {
                if (y < (rows[x].length - 1))
                    row += rows[x][y] + this.CELL_DIVIDER
                else
                    row += rows[x][y] + this.LINE_DIVIDER
            }
            exported.push(row);
        }
        var csv = new Blob(exported, { type: "text/csv" });
        var downloadLink = document.createElement("a");
        downloadLink.download = title + '.csv';
        downloadLink.href = window.URL.createObjectURL(csv);
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.click();
    }

    static guessDelimiters(csv, possibleDelimiters) {
        return possibleDelimiters.filter(weedOut);

        function weedOut(delimiter) {
            var cache = -1;
            return csv.split('\n').every(checkLength);

            function checkLength(line) {
                if (!line) {
                    return true;
                }

                var length = line.split(delimiter).length;
                if (cache < 0) {
                    cache = length;
                }
                return cache === length && length > 1;
            }
        }
    }

    static ensure_default_delimiters(csv) {
        return this.ensure_delimiters(CSV.LINE_DIVIDER, CSV.CELL_DIVIDER, csv)
    }

    /**
     * 
     * Checks that delimiters exist in CSV String and expects these dividers to ensure
     * the same amount of columns per row.
     * 
     * @param {string} rowdel 
     * @param {string} coldel 
     * @param {string} csv_string 
     * @returns {boolean}
     */
    static ensure_delimiters(rowdel, coldel, csv_string) {
        csv_string.replace(/\r\n/g, '\n'); // Replaces windows new line to linux.
        if (!csv_string.includes(rowdel)) // If row delimiter not found
            throw new Error("LINE_DEL_NOT_FOUND")
        if (!csv_string.includes(coldel)) // If cell delimiter not found
            throw new Error("COL_DEL_NOT_FOUND")
        var rows = csv_string.split(rowdel)
        var rows_amount = rows.length
        var expected_columns = rows[0].split(CSV.CELL_DIVIDER).length
        var i = 0
        while (i < rows_amount && rows[i].split(CSV.CELL_DIVIDER).length == expected_columns) {
            ++i;
        }
        if (i < rows_amount - 1)
            throw new Error("PARSING_ERROR")
        return true
    }
}
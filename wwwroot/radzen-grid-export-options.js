window.RadzenGridExport = {
	exportToCSV: function (elementId) {

		let table = undefined;
		if (elementId === undefined || elementId === "" || elementId === null)
			table = $(".rz-data-grid").first();
		else
			table = $("#" + elementId);

		//Collect header columns
		var headers = RadzenGridExport.collectHeaders(table, true);

		//Collect data
		var data = RadzenGridExport.collectData(table, true, false);
		let csvContent = "sep=|" + "\r\n";

		let headerRow = headers.join('|');
		csvContent += headerRow + "\r\n";

		data.forEach(function (rowArray) {

			if (rowArray.length > 0 &&
				rowArray.filter(x => x === '').length !== rowArray.length &&
				rowArray.filter(x => x === '""').length !== rowArray.length) {
				let row = rowArray.join('|');
				csvContent += row + "\r\n";
			}
		});

		var link = window.document.createElement("a");
		link.setAttribute("href", "data:text/csv;charset=utf-8,\uFEFF" + encodeURI(csvContent));
		link.setAttribute("download", "export.csv");
		link.click();
	},
	exportToExcel: function (elementId) {
		let table = undefined;
		if (elementId === undefined || elementId === "" || elementId === null)
			table = $(".rz-data-grid").first();
		else
			table = $("#" + elementId);

		//Collect header columns
		var headers = RadzenGridExport.collectHeaders(table, false);

		//Collect data
		var data = RadzenGridExport.collectData(table, false, true);
		data = data.filter(x => x.filter(y => y === "").length !== x.length);

		data.unshift(headers);

		var wb = XLSX.utils.book_new();
		wb.SheetNames.push("Export");

		var ws = XLSX.utils.aoa_to_sheet(data);
		wb.Sheets["Export"] = ws;

		var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
		var wDownload = s2ab(wbout);
		var blob = new Blob([wDownload], { type: "application/octet-stream" });

		var link = window.document.createElement("a");
		link.setAttribute("href", window.URL.createObjectURL(blob));
		link.setAttribute("download", "export.xlsx");
		link.click();
	},
	collectHeaders: function (tableRef, quoted) {
		//Collect header columns
		var tableHeaderTable = $("table", tableRef);
		var ths = $("thead>tr>th", tableHeaderTable);

		var headers = [];

		ths.each(function (index, element) {
			var jqueryElement = $(element);
			var title = $(".rz-column-title", jqueryElement).first().text().trim();

			if (title != undefined && title != "")
				headers.push(quoted === true ? "\""+title + "\"" : title);
		});

		return headers;
	},
	collectData: function (tableRef, quoted, ignoreNumbers) {
		//Collect data
		var data = [];
		var tableBodyTable = $("table", tableRef);
		var trs = $("tbody>tr", tableBodyTable);

		trs.each(function (index, element) {
			var tds = $(element).find("td");
			var row = [];

			tds.each(function (index1, element1) {
				var jqueryElement = $(element1);
				var isNumber = ignoreNumbers === true ? false : jqueryElement.hasClass("radzen-blazor-gridexportoptions-column-number");
				var text = $(".rz-cell-data", jqueryElement).first().text().trim();

				if (text != undefined)
					row.push(quoted === true ? (isNumber === true && text != "" ? "="+"\""+text+"\"" : "\""+text+"\"") : (isNumber === true && text != "" ? "="+text : text));
			});

			data.push(row);
		});

		return data;
	}
};

function s2ab(s) {
	var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
	var view = new Uint8Array(buf);  //create uint8array as viewer
	for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
	return buf;
}
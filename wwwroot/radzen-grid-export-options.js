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
		var data = RadzenGridExport.collectData(table, true);
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
	collectData: function (tableRef, quoted) {
		//Collect data
		var data = [];
		var tableBodyTable = $("table", tableRef);
		var trs = $("tbody>tr", tableBodyTable);

		trs.each(function (index, element) {
			var tds = $(element).find("td");
			var row = [];

			tds.each(function (index1, element1) {
				var jqueryElement = $(element1);
				var isNumber = jqueryElement.hasClass("radzen-blazor-gridexportoptions-column-number");
				var text = $(".rz-cell-data", jqueryElement).first().text().trim();

				if (text != undefined)
					row.push(quoted === true ? (isNumber === true && text != "" ? "="+"\""+text+"\"" : "\""+text+"\"") : (isNumber === true && text != "" ? "="+text : text));
			});

			data.push(row);
		});

		return data;
	}
};
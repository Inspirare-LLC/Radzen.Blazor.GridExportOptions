window.RadzenGridExport = {
	exportToCSV: function (elementId) {

		let table = undefined;
		if (elementId === undefined || elementId === "" || elementId === null)
			table = $(".rz-data-grid").first();
		else
			table = $("#" + elementId);

		//Collect header columns
		var headers = RadzenGridExport.collectHeaders(table);

		//Collect data
		var data = RadzenGridExport.collectData(table);
		let csvContent = "";

		let headerRow = headers.join(";");
		csvContent += headerRow + "\r\n";

		data.forEach(function (rowArray) {

			if (rowArray.length > 0) {
				let row = rowArray.join(";");
				csvContent += row + "\r\n";
			}
		});

		var link = window.document.createElement("a");
		link.setAttribute("href", "data:text/csv;charset=utf-8,%EF%BB%BF" + encodeURI(csvContent));
		link.setAttribute("download", "export.csv");
		link.click();
	},
	collectHeaders: function (tableRef) {
		//Collect header columns
		var tableHeaderTable = $("table", tableRef);
		var ths = $("thead>tr>th", tableHeaderTable);

		var headers = [];

		ths.each(function (index, element) {
			var jqueryElement = $(element);
			var title = $(".rz-column-title", jqueryElement).first().text().trim();

			if (title != undefined && title != "")
				headers.push(title);
		});

		return headers;
	},
	collectData: function (tableRef) {
		//Collect data
		var data = [];
		var tableBodyTable = $("table", tableRef);
		var trs = $("tbody>tr", tableBodyTable);

		trs.each(function (index, element) {
			var tds = $(element).find("td");
			var row = [];

			tds.each(function (index1, element1) {
				var jqueryElement = $(element1);
				var text = $(".rz-cell-data", jqueryElement).first().text().trim();

				if (text != undefined && text != "")
					row.push(text);
			});

			data.push(row);
		});

		return data;
	}
};
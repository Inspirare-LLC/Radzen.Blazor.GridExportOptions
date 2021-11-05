window.RadzenGridExport = {
	exportToCSV: function (elementId, notExportableClass) {

		let table = undefined;
		if (elementId === undefined || elementId === "" || elementId === null)
			table = $(".rz-data-grid").first();
		else
			table = $("#" + elementId);

		//Collect header columns
		var headers = RadzenGridExport.collectHeaders(table, true, notExportableClass);

		//Collect data
		var data = RadzenGridExport.collectData(table, true, false, notExportableClass);
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
	exportToExcel: function (elementId, notExportableClass) {
		let table = undefined;
		if (elementId === undefined || elementId === "" || elementId === null)
			table = $(".rz-data-grid").first();
		else
			table = $("#" + elementId);

		//Collect header columns
		var headers = RadzenGridExport.collectHeaders(table, false, notExportableClass);

		//Collect data
		var types = [];
		var data = RadzenGridExport.collectData(table, false, true, notExportableClass, types);
		data = data.filter(x => x.filter(y => y === "").length !== x.length);

		var dataCount = data.length;

		//Add headers to data
		data.unshift(headers);

		var ws = XLSX.utils.aoa_to_sheet(data);
		ws['!autofilter'] = { ref: "A1:XX1" };

		//Update column types
		types.forEach(function (item, index) {
			for (var r = 1; r <= dataCount + 1; r++) {
				var cellRef = XLSX.utils.encode_cell({ c: index, r: r });
				var cell = ws[cellRef];
				if (!cell)
					continue;

				if (item === "number")
					cell.z = '0.00';
				else if (item === "date")
					cell.t = 'd';
			}
		});

		var wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, "Export");

		XLSX.writeFile(wb, 'export.xlsx', { bookType: 'xlsx', type: 'array' })
	},
	collectHeaders: function (tableRef, quoted, notExportableClass) {
		//Collect header columns
		var tableHeaderTable = $("table", tableRef);
		var ths = $("thead>tr>th", tableHeaderTable);

		var headers = [];

		ths.each(function (index, element) {
			var jqueryElement = $(element);

			//If column is marked as non exportable, skip it.
			if (notExportableClass && jqueryElement.hasClass(notExportableClass))
				return;

			var title = $(".rz-column-title", jqueryElement).first().text().trim();
			if (title != undefined && title != "")
				headers.push(quoted === true ? "\""+title + "\"" : title);
		});

		return headers;
	},
	collectData: function (tableRef, quoted, ignoreNumbers, notExportableClass, types) {
		//Collect data
		var data = [];
		var tableBodyTable = $("table", tableRef);
		var trs = $("tbody>tr", tableBodyTable);
		var allTypes = [];

		trs.each(function (index, element) {
			var tds = $(element).find("td");
			var row = [];
			var localTypes = [];

			tds.each(function (index1, element1) {
				var jqueryElement = $(element1);

				//If column is marked as non exportable, skip it.
				if (notExportableClass && jqueryElement.hasClass(notExportableClass))
					return;

				var isNumber = ignoreNumbers === true ? false : jqueryElement.hasClass("radzen-blazor-gridexportoptions-column-number");
				var text = $(".rz-cell-data", jqueryElement).first().text().trim();
				var type = getType(text);
				localTypes.push(type);

				if (text != undefined) {
					var numberParse = type === "number" ? parseFloat(text.replace(",", ".")) : null;
					row.push(quoted === true ? (isNumber === true && text != "" ? "=" + "\"" + text + "\"" : "\"" + text + "\"") : (isNumber === true && text != "" ? "=" + text : (numberParse != null ? numberParse : text)));
				}
			});

			data.push(row);
			allTypes = localTypes;
		});

		if (types)
			types.push.apply(types, allTypes);

		return data;
	}
};

function s2ab(s) {
	var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
	var view = new Uint8Array(buf);  //create uint8array as viewer
	for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
	return buf;
}

function getType(str) {
	var numberRegex = new RegExp(/^-?[0-9]+((,|\.)\d+)?$/);
	var isNumber = numberRegex.test(str);
	if (isNumber)
		return "number";

	//TODO: replace with a better one
	var dateRegex = new RegExp(/^(([0-9][0-9][0-9][0-9])-((0[1-9])|(1[0-2])|[0-9])-([0-3][0-9]))|(([0-3][0-9])\.((0[1-9])|(1[0-2])|[0-9])\.([0-9][0-9][0-9][0-9]))|(((0[1-9])|(1[0-2])|[0-9])\/([0-3][0-9])\/([0-9][0-9][0-9][0-9]))$/);
	var isDate = dateRegex.test(str);
	if (isDate)
		return "date";

	return "string";
}
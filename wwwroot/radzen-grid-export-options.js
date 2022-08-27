window.RadzenGridExport = {
	exportToCSV: function (elementId, notExportableClass, skipFirstColumn) {

		let table = undefined;
		if (elementId === undefined || elementId === "" || elementId === null)
			table = $(".rz-data-grid").first();
		else
			table = $("#" + elementId);

		//Collect header columns
		var headers = RadzenGridExport.collectHeaders(table, true, notExportableClass);

		//Collect data
		var data = RadzenGridExport.collectData(table, true, false, notExportableClass, false, '', [], skipFirstColumn);
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
	exportToCSVDataSource: function (referenceValues, referenceValueFieldNames, dataJSONDivId, fieldNames, fieldTitles, cssClasses) {

		//Compute header row
		var header = fieldTitles.join('|');
		let csvContent = "sep=|" + "\r\n";
		csvContent += header + "\r\n";

		//Collect data according to visible and exportable columns
		var data = RadzenGridExport.collectDataFromDataSourceJSON(referenceValues, referenceValueFieldNames, dataJSONDivId, fieldNames, true, undefined, false, false, cssClasses);
		 
		//Loop data and collect fields
		data.forEach(function (item, index) {
			csvContent += item.join('|') + "\r\n";
		});

		var link = window.document.createElement("a");
		link.setAttribute("href", "data:text/csv;charset=utf-8,\uFEFF" + encodeURI(csvContent));
		link.setAttribute("download", "export.csv");
		link.click();
	},
	exportToExcel: function (elementId, notExportableClass, dateFormat, skipFirstColumn) {
		let table = undefined;
		if (elementId === undefined || elementId === "" || elementId === null)
			table = $(".rz-data-grid").first();
		else
			table = $("#" + elementId);

		//Collect header columns
		var headers = RadzenGridExport.collectHeaders(table, false, notExportableClass);

		//Collect data
		var types = [];
		var data = RadzenGridExport.collectData(table, false, true, notExportableClass, true, dateFormat, types, skipFirstColumn);
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
	exportToExcelDataSource: function (referenceValues, referenceValueFieldNames, dataJSONDivId, fieldNames, fieldTitles, dateFormat, cssClasses) {

		//Collect data according to visible and exportable columns
		var types = [];
		var data = RadzenGridExport.collectDataFromDataSourceJSON(referenceValues, referenceValueFieldNames, dataJSONDivId, fieldNames, false, dateFormat, true, true, cssClasses, types);

		var dataCount = data.length;

		//Add headers to data
		data.unshift(fieldTitles);

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
	collectData: function (tableRef, quoted, ignoreNumbers, notExportableClass, isExcel, dateFormat, types, skipFirstColumn) {
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

				//skip first column, if needed
				if (skipFirstColumn &&
					index1 === 0)
					return;

				//If column is marked as non exportable, skip it.
				if (notExportableClass && jqueryElement.hasClass(notExportableClass))
					return;

				var isNumber = ignoreNumbers === true ? false : jqueryElement.hasClass("radzen-blazor-gridexportoptions-column-number");
				var text = $(".rz-cell-data", jqueryElement).first().text().trim();
				var type = jqueryElement.hasClass("radzen-blazor-gridexportoptions-column-number") ? "string" : getType(text);
				localTypes.push(type);

				if (text != undefined) {
					if (type === "date" && isExcel && dateFormat) {
						var date = luxon.DateTime.fromFormat(text, dateFormat);
						row.push(date.toISO());
					} else {
						var numberParse = type === "number" ? parseFloat(text.replace(",", ".")) : null;
						row.push(quoted === true ? (isNumber === true && text != "" ? "=" + "\"" + text + "\"" : "\"" + text + "\"") : (isNumber === true && text != "" ? "=" + text : (numberParse != null ? numberParse : text)));
					}
				}
			});

			data.push(row);
			allTypes = localTypes;
		});

		if (types)
			types.push.apply(types, allTypes);

		return data;
	},
	collectDataFromDataSourceJSON: function (referenceValues, referenceValueFieldNames, dataJSONDivId, fieldNames, isQuoted, dateFormat, isExcel, ignoreNumbers, cssClasses, types, skipFirstColumn) {
		//Data is link to div that contains json array
		var dataJSON = $("#" + dataJSONDivId).text();
		console.log(dataJSONDivId);
		console.log(dataJSON);
		var data = JSON.parse(dataJSON);
		var dataRows = [];
		var allTypes = [];

		//Loop data and collect fields
		data.forEach(function (item, index) {
			var rowData = [];
			var localTypes = [];

			fieldNames.forEach(function (item2, index2) {
				var fieldValue = String(item[item2]);
				if (referenceValueFieldNames.includes(item2))
					fieldValue = String(referenceValues.find(x => x["fieldName"] === item2 && x["fieldValue"] === fieldValue)["ref"]);

				if (fieldValue === undefined ||
					fieldValue === "null" ||
					fieldValue === "null")
					fieldValue = "";

				if (fieldValue.includes("0001-01-01"))
					fieldValue = "";

				var thisCssClasses = cssClasses.find(x => x["key"] === item2)["value"];

				var isNumber = ignoreNumbers === true ? false : thisCssClasses.includes("radzen-blazor-gridexportoptions-column-number");
				var type = thisCssClasses.includes("radzen-blazor-gridexportoptions-column-number") ? "string" : getType(fieldValue);
				localTypes.push(type);

				if (type === "date" && isExcel && dateFormat) {
					var date = luxon.DateTime.fromFormat(fieldValue, dateFormat);
					rowData.push(date.toISO());
				} else {
					var numberParse = type === "number" ? parseFloat(fieldValue.replace(",", ".")) : null;
					rowData.push(isQuoted === true ? (isNumber === true && fieldValue != "" ? "=" + "\"" + fieldValue + "\"" : "\"" + fieldValue + "\"") : (isNumber === true && fieldValue != "" ? "=" + fieldValue : (numberParse != null ? numberParse : fieldValue)));
				}
			});

			dataRows.push(rowData);
			allTypes = localTypes;
		});

		if (types)
			types.push.apply(types, allTypes);

		return dataRows;
	}
};

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
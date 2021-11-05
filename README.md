# Radzen.Blazor.GridExportOptions
Radzen blazor grid export options

Exports radzen blazor grid content into different formats.

Currenty only CSV and Excel export is available.

For Excel export regex is used to recognize numbers and dates in order to assign correct types in excel.
Suggestions for better regex expressions are welcome :)

# Breaking change

From version 2.0.0.0 `RadzenGrid` has been replaced with `RadzenDataGrid`.

# Nuget package
Available as nuget package at https://www.nuget.org/packages/Radzen.Blazor.GridExportOptions/
Install it in shared code project.

# Usage

Include jQuery in `_Host.cshtml` file, if it isn't already included in your project.

Include `<script src="~/_content/radzen.blazor.gridexportoptions/radzen-grid-export-options.js"></script>` in `_Host.cshtml` file.

To use excel export include `<script src="~/_content/radzen.blazor.gridexportoptions/xlsx.full.min.js"></script>` in `_Host.cshtml` file.

Use the control like so:

    <RadzenGridExportOptions Grid="@grid"/>
    <RadzenDataGrid @ref="@grid"/>

    @code{
      RadzenDataGrid<TItem> grid;
    }

Button size, style, css style can all be customized through parameters.
Csv or excel export can be enabled/disabled through parameter `CsvExport` and `ExcelExport`.


**For csv export class (`CssClass`) parameter on column can be used to signify that the column should be treated as text. This is used for data that is consistent of numbers, but isn't numbers by nature. Such as, credit card numbers, IBAN and etc.**

Usage sample:
`<RadzenDataGridColumn TItem="Item" Property="IBAN" Title="IBAN" CssClass="radzen-blazor-gridexportoptions-column-number" />`


**By default it looks for radzen table with class `rz-datatable`. Pass in `GridId` parameter to look for the radzen table by css id.**

**A column can be excluded from export by specifying the css style `CssClass` and `HeaderCssClass` on `RadzenDataGridColumn` and passing the same to `RadzenGridExportOptions` via parameter `NotExportableClass`.**

Usage sample:
```
    <RadzenGridExportOptions Grid="@grid" NotExportableClass="exclude-from-radzen-export"/>
    <RadzenDataGrid @ref="@grid">
        <Columns>
            <RadzenDataGridColumn TItem="Person" Property="FirstName" Title="First Name" CssClass="exclude-from-radzen-export" HeaderCssClass="exclude-from-radzen-export" />
        </Columns>
    </RadzenDataGrid>

    @code{
      RadzenDataGrid<TItem> grid;
    }
```

# Contributions

Any contributions are welcome in the form of pull requests.

# Issues

Issues can be raised in the `Issue` section where I'll try to address all of them.

# Radzen.Blazor.GridExportOptions
Radzen blazor grid export options

Exports radzen blazor grid content into different formats.

Currenty only CSV available.

# Breaking change

From version 2.0.0.0 `RadzenGrid` has been replaced with `RadzenDataGrid`.

# Nuget package
Available as nuget package at https://www.nuget.org/packages/Radzen.Blazor.GridExportOptions/
Install it in shared code project.

# Usage

Include `<script src="~/_content/radzen.blazor.gridexportoptions/radzen-grid-export-options.js"></script>` in `_Host.cshtml` file.

Use the control like so:

    <RadzenGridExportOptions Grid="@grid"/>
    <RadzenDataGrid @ref="@grid"/>

    @code{
      RadzenDataGrid<TItem> grid;
    }

Button size, style, css style can all be customized through parameters.

By default it looks for radzen table with class `rz-datatable`. Pass in `GridId` parameter to look for the radzen table by css id.

# Contributions

Any contributions are welcome in the form of pull requests.

# Issues

Issues can be raised in the `Issue` section where I'll try to address all of them.

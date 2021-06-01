# Radzen.Blazor.GridExportOptions
Radzen blazor grid export options

Exports radzen blazor grid content into different formats.

Currenty only CSV available.

# Nuget package
Available as nuget package at https://www.nuget.org/packages/Radzen.Blazor.GridExportOptions/
Install it in shared code project.

# Usage

Include `<script src="~/_content/radzen.blazor.gridexportoptions/radzen-grid-export-options.js"></script>` in `_Host.cshtml` file.

Use the control like so:

    <RadzenGridExportOptions Grid="@grid"/>
    <RadzenGrid @ref="@grid"/>

    @code{
      RadzenGrid<TItem> grid;
    }

Button size, style, css style can all be customized through parameters.

# Contributions

Any contributions are welcome in the form of pull requests.

# Issues

Issues can be raised in the `Issue` section where I'll try to address all of them.

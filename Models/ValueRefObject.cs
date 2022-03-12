using System;
using System.Collections.Generic;
using System.Text;

namespace Radzen.Blazor.GridExportOptions.Models
{
    public class ValueRefObject
    {
        public ValueRefObject(string fieldName, string fieldValue, string referenceValue)
        {
            FieldName = fieldName;
            FieldValue = fieldValue;
            Ref = referenceValue;
        }

        public string FieldName { get; set; }
        public string FieldValue { get; set; }
        public string Ref { get; set; }
    }
}

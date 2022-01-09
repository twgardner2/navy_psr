

import * as d3 from "d3";
const { fields }= require('../../schema.js')

export function parse_data_from_table(e, d) {
  
    let tableFields=Object.values(fields);
    // Array to populate with data from table
    var parsed_data = [];
  
    // Selection of (non-header) table rows
    var table_data_rows = d3.selectAll("tr.data_row");
      
    d3.selectAll("tr.data_row").each(function (d, i, j) {
      var row_data = {};
  
      j[i].childNodes.forEach(function (el) {
        if (el.className == "table_field") {
          // Get key and value in cell
          var cell_key = el.dataset.key;
          var cell_value = el.innerText;

          // Coerce to correct data type
          var schema_entry = tableFields.filter((el) => el.name == cell_key);
          var cell_data_type = schema_entry[0] ? schema_entry[0].type : null;
          var valid_values = schema_entry[0] ? schema_entry[0].valid : null;
  
          var typed_cell_value;
          if (cell_data_type == "text") {
            typed_cell_value = cell_value;

          } else if (cell_data_type == "number") {
            typed_cell_value = parseFloat(cell_value) || 0;

          }
          // else if (cell_data_type == 'date') {typed_cell_value = Date.parse(cell_value).toISOString();}
          else if (cell_data_type == "date") {
            
            var date = new Date(cell_value);
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var year = date.getFullYear();
            typed_cell_value = new Date(`${month}/${day}/${year}`);
            
          }
          
          row_data[cell_key] = typed_cell_value;
  
        }
      });

      parsed_data.push(row_data);
    });

    return parsed_data;
  }
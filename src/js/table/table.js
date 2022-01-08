

import * as lib from "../lib.js";

const {fields} = require('../data/schema');
const { getPageElements }=require('../page-components')

const tableFields=Object.values(fields);

export const populate_table = (data) => {
  const {
    table
  }=getPageElements();


  // Add form header row
  var header = table
    .append("tr")
    .attr("class", "table_row header")
    // .style('border-collapse', 'collapse')
    .selectAll("th")
    .data(tableFields)
    .enter()
    .append("th")
    .attr("class", "header_items")
    .text((d) => d.display);
  // .style('margin', '10px')

  // Add table rows
  var table_rows = table
    // Enter a table row for each FITREP
    .selectAll("tr.data_row")
    .data(data)
    .enter()
    .append("tr")
    .attr("class", "data_row");

  // Add table row data cells
  var table_data_cells = table_rows
    // Enter a table data for each key of the FITREP object
    .selectAll("td")
    .data(function (d) {
      // console.log(Object.entries(d));
      return Object.entries(d);
    })
    // .data(  d => Object.entries(d)  )
    .enter()
    .append("td")
    .classed("table_field", true)
    .attr("key", (d) => d[0])
    // Format and enter values for each field
    .text((d) => {
      var [field, val] = d;
      var schema_entry = tableFields.filter((el) => el.name == d[0]);
      var type = schema_entry[0] ? schema_entry[0].type : null;

      if (type == "text") val = val.toUpperCase();
      if (type == "date") val = lib.date_formatter(d[1]);
      if (field == "trait_avg") {
        // console.log(parseFloat(val));
        val = val ? Number.parseFloat(val).toFixed(2) : 0;
      }
      return val;
    });

  // Add table row edit/save buttons
  var row_buttons = table_rows
    .append("td")
    .attr("class", "button")
    .append("button")
    .attr("type", "button")
    .attr("row_index", (d, i) => i)
    .text("edit")
    .on("click", toggle_rows);
};


export function toggle_rows(e, d) {
  var clicked_button = d3.select(this);
  var parent_row = d3.select(this.parentNode.parentNode);

  // If not currently editing row
  if (!this.classList.contains("editing")) {
    console.log("switch row to edit mode");

    // Toggle button text to 'save'
    clicked_button.text("save");

    // Give this row's <td>s and the button an 'editing' class
    clicked_button.classed("editing", true);
    parent_row.selectAll("td").classed("editing", true);

    // Append an <input> to each <td.table_field>
    parent_row.selectAll("td.table_field").each(function (d, i) {
      var schema_entry = tableFields.filter((el) => el.name == d[0])[0];

      var width =
        schema_entry && schema_entry.width ? schema_entry.width : "100%";

      var table_field = d3.select(this);
      var value = table_field.text();
      table_field.text("");
      table_field.append("input").attr("value", value).style("width", width);
    });
  } else {
    // If currently editing row

    console.log("switch row back to saved mode");

    // Remove <input> from each <td.table_field>, replace with value as text
    parent_row.selectAll("td.editing").each(function (d, i) {
      // Save reference to <td>
      var td = d3.select(this);

      // If table_field, rather than the edit/save button
      if (td.classed("table_field")) {
        // Validate input: get data type, any valid values, check input for compliance
        var td_key = td.data()[0][0];
        var schema_entry = tableFields.filter((el) => el.name == td_key);
        var cell_data_type = schema_entry[0] ? schema_entry[0].type : null;
        var valid_values = schema_entry[0] ? schema_entry[0].valid : null;
        // console.log(cell_data_type);
        // console.log(valid_values);
        var new_value = td.select("input").node().value;

        if (cell_data_type == "text") {
          new_value = new_value.toUpperCase();
        }

        if (valid_values && !valid_values.includes(new_value)) {
          console.log(valid_values);
          console.log(new_value);
          alert("stop");
        }

        td.select("input").remove();
        td.text(new_value);

        // Toggle button text to 'edit'
        clicked_button.text("edit");

        // Remove this row's <td>s and the button an 'editing' class
        clicked_button.classed("editing", false);
        parent_row.selectAll("td").classed("editing", false);
      }
    });
  }
}
"use strict";

// Sizing variables
export const canvas_width = 1500;
export const canvas_height = 650;
export const margin = { top: 30, right: 30, bottom: 30, left: 30, gap: 10 };

export const y_axis_width = 40;

export const bar_width = 1000;
export const bar_height = 40;

export const fitrep_width = 1000;
export const fitrep_height = 300;

export function add_days_to_date(date, n_days) {
  var days_in_ms = n_days * 24 * 3600 * 1000;
  return new Date(date.getTime() + days_in_ms);
}

// Horizontal (time) scale - defined in scripts.js

// Vertical (RSCA) scale
export const rsca_scale = d3
  .scaleLinear()
  .domain([-1.2, 1.2])
  .range([fitrep_height, 0]);

// Colors
export const rank_bar_color = "lightgrey";
export const regular_command_bar_color = "#2e2e80";
export const at_cc_command_bar_color = "gold";

// FITREP marker styling
export const prom_rec_categories = ["EP", "MP", "P", "PR", "SP", "NOB"];
export const fitrep_traffic_legend_sizes = [1, 3, 5, 10, 15];
// export const ep_color = "green";
export const ep_color = "#48ff00";
export const mp_color = "blue";
export const p_color = "black";
export const pr_color = "yellow";
export const sp_color = "red";
export const nob_color = "lightgrey";

export const ep_shape = d3.symbol().type(d3.symbolCircle);
export const mp_shape = d3.symbol().type(d3.symbolCircle);
export const p_shape = d3.symbol().type(d3.symbolCircle);
export const pr_shape = d3.symbol().type(d3.symbolCircle);
export const sp_shape = d3.symbol().type(d3.symbolCircle);
export const nob_shape = d3.symbol().type(d3.symbolCircle);
// symbolDiamond, symbolStar, symbolWye, symbolCircle, symbolCross, symbolSquare, symbolTriangle

export const fitrep_legend_marker_size = 10;
export const fitrep_marker_opacity = 0.85;
export const fitrep_marker_stroke_width = 1.5;

export const fitrep_color_scale = d3
  .scaleOrdinal()
  .domain(["EP", "MP", "P", "PR", "SP", "NOB"])
  .range([ep_color, mp_color, p_color, pr_color, sp_color, nob_color]);

export const fitrep_shape_scale = d3
  .scaleOrdinal()
  .domain(["EP", "MP", "P", "PR", "SP", "NOB"])
  .range([ep_shape, mp_shape, p_shape, pr_shape, sp_shape, nob_shape]);

export const fitrep_marker_size = d3
  .scaleLinear()
  .domain([1, 15])
  .range([50, 350])
  .clamp(true);

// Data schema

export var schema = {
  fields: [
    { name: "name", type: "text", display: "Name", width: "100%" },
    {
      name: "paygrade",
      type: "text",
      display: "Paygrade",
      valid: ["O1", "O2", "O3", "O4", "O5", "O6", "O7", "O8", "O9", "O10"],
    },
    { name: "station", type: "text", display: "Station" },
    { name: "duty", type: "text", display: "Duty" },
    { name: "start_date", type: "date", display: "Start Date" },
    { name: "end_date", type: "date", display: "End Date" },
    { name: "months", type: "number", display: "Months", width: "30px" },
    { name: "rs_name", type: "text", display: "Reporting Senior Name" },
    {
      name: "rs_paygrade",
      type: "text",
      display: "Reporting Senior Paygrade",
      valid: ["O1", "O2", "O3", "O4", "O5", "O6", "O7", "O8", "O9", "O10"],
    },
    { name: "rs_title", type: "text", display: "Reporting Senior Title" },

    { name: "trait_1", type: "number", display: "# of 1s", width: "30px" },
    { name: "trait_2", type: "number", display: "# of 2s", width: "30px" },
    { name: "trait_3", type: "number", display: "# of 3s", width: "30px" },
    { name: "trait_4", type: "number", display: "# of 4s", width: "30px" },
    { name: "trait_5", type: "number", display: "# of 5s", width: "30px" },

    { name: "trait_avg", type: "number", display: "Trait Avg" },
    {
      name: "rsca",
      type: "number",
      display: "Reporting Senior Cumulative Avg",
    },
    {
      name: "prom_rec",
      type: "text",
      display: "Promotion Recommendation",
      valid: ["NOB", "SP", "PR", "P", "MP", "EP"],
    },
    { name: "n_sp", type: "number", display: "# SP", width: "30px" },
    { name: "n_pr", type: "number", display: "# PR", width: "30px" },
    { name: "n_p", type: "number", display: "# P", width: "30px" },
    { name: "n_mp", type: "number", display: "# MP", width: "30px" },
    { name: "n_ep", type: "number", display: "# EP", width: "30px" },
    { name: "prt", type: "text", display: "PRT" },
    { name: "rpt_type", type: "text", display: "Report Type" },
  ],
};

// Formatters
export const date_formatter = new Intl.DateTimeFormat("en-US").format;

export function get_dates_for_values_of_column(
  psr,
  col,
  regex = new RegExp(".*", "g"),
  regex_col = "rpt_type"
) {
  // Filter regex_col on regex, if specified
  var filtered_fitreps = psr.filter((fitrep) => {
    // console.log(fitrep.rpt_type);
    // console.log(fitrep.rpt_type.match(regex));
    return fitrep[regex_col].match(regex);
  });

  // Get unique values of col
  var unique_values_of_col = [
    ...new Set(filtered_fitreps.map((fitrep) => fitrep[col])),
  ];

  // return(unique_values_of_col);

  // Map over unique values, returning earliest start_date for each
  var dates = unique_values_of_col.map((value, i) => {
    // FITREPs for this value of col
    var fitreps_this_value_of_col = filtered_fitreps.filter(
      (fitrep) => fitrep[col] == value
    );

    // Reduce FITREPs this value of col down to earliest start_date
    var first_start_date_this_value_of_col = fitreps_this_value_of_col.reduce(
      function (acc, cur, idx, array) {
        var return_val;
        if (idx == 0) {
          return_val = cur.start_date;
        } else {
          return_val = cur.start_date < acc ? cur.start_date : acc;
        }
        return return_val;
      },
      null
    );

    // Reduce FITREPs this command down to latest end_date
    var last_end_date_this_value_of_col = fitreps_this_value_of_col.reduce(
      function (acc, cur, idx, array) {
        var return_val;

        if (idx == 0) {
          return_val = cur.end_date;
        } else {
          return_val = cur.end_date > acc ? cur.end_date : acc;
        }
        return return_val;
      },
      null
    );

    // Return object with value of col, first FITREP start date, and last FITREP end_date
    return {
      value: value,
      start: first_start_date_this_value_of_col,
      end: last_end_date_this_value_of_col,
    };
  });

  return dates;
}

export function fitreps_grouped_by_paygrade_and_repsen(psr) {
  var comparable_fitreps = d3.group(
    psr,
    (d) => d.paygrade,
    (d) => d.rs_name
  );
  // console.log(comparable_fitreps);

  var array_from_maps = [];
  comparable_fitreps.forEach((a) => {
    // console.log(a);
    a.forEach((b) => {
      // console.log(b);
      array_from_maps.push(b);
    });
  });

  return array_from_maps;
}

export function fitrep_gaps(psr) {
  var fitrep_dates = psr.map((d) => [d.start_date, d.end_date]);

  var fitrep_gaps = fitrep_dates.map(function (el, i, array) {
    if (array[i + 1]) {
      const one_day = 1 * 24 * 3600 * 1000;
      // var end_this_fitrep = el[1];
      var end_this_fitrep = new Date(el[1]);
      // console.log(end_this_fitrep);
      var day_after_end_this_fitrep = new Date(
        end_this_fitrep.getTime() + one_day
      );

      var start_next_fitrep = new Date(array[i + 1][0]);
      var day_before_start_next_fitrep = new Date(
        start_next_fitrep.getTime() - one_day
      );

      if (day_after_end_this_fitrep < start_next_fitrep) {
        return [day_after_end_this_fitrep, day_before_start_next_fitrep];
      }
    } else {
      return undefined;
    }
  });

  return fitrep_gaps.filter((el) => el != null);
}

export function fitrep_tooltip(d) {
  var delta = d.trait_avg ? (d.trait_avg - d.rsca).toFixed(2) : "n/a";
  delta = delta == "-0.00" ? "0.00" : delta;
  delta = delta > 0 ? "+" + delta : delta;

  var return_val = `
    <strong>Period:</strong> ${date_formatter(
      d.start_date
    )} to ${date_formatter(d.end_date)}<br>
    <strong>Report Type:</strong> ${d.rpt_type}<br>
    <br>
    <strong>Reporting Senior:</strong> ${d.rs_name}<br>
    <strong>Reporting Senior Title:</strong> ${d.rs_title}<br>
    <strong>Command:</strong> ${d.station}<br>
    <br>
    <strong>Paygrade:</strong> ${d.paygrade}<br>
    <strong>Trait Average:</strong> ${
      d.trait_avg ? d.trait_avg.toFixed(2) : "n/a"
    }<br>
    <strong>RSCA:</strong> ${d.rsca ? d.rsca : "n/a"}<br>
    <strong>Delta:</strong> ${delta} <br>
    <br>
    <table>
        <tr>
            <td>${
              d.prom_rec.toUpperCase() == "SP" ? "<strong>SP</strong>" : "SP"
            }</td>
            <td>${
              d.prom_rec.toUpperCase() == "PR" ? "<strong>PR</strong>" : "PR"
            }</td>
            <td>${
              d.prom_rec.toUpperCase() == "P" ? "<strong>P</strong>" : "P"
            }</td>
            <td>${
              d.prom_rec.toUpperCase() == "MP" ? "<strong>MP</strong>" : "MP"
            }</td>
            <td>${
              d.prom_rec.toUpperCase() == "EP" ? "<strong>EP</strong>" : "EP"
            }</td>
        </tr>
        <tr>
            <td>${
              d.prom_rec.toUpperCase() == "SP"
                ? `<strong>${d.n_sp}</strong>`
                : `${d.n_sp}`
            }</td>
            <td>${
              d.prom_rec.toUpperCase() == "PR"
                ? `<strong>${d.n_pr}</strong>`
                : `${d.n_pr}`
            }</td>
            <td>${
              d.prom_rec.toUpperCase() == "P"
                ? `<strong>${d.n_p}</strong>`
                : `${d.n_p}`
            }</td>
            <td>${
              d.prom_rec.toUpperCase() == "MP"
                ? `<strong>${d.n_mp}</strong>`
                : `${d.n_mp}`
            }</td>
            <td>${
              d.prom_rec.toUpperCase() == "EP"
                ? `<strong>${d.n_ep}</strong>`
                : `${d.n_ep}`
            }</td>
        </tr>
    </table>
    `;
  // console.log(return_val);
  return return_val;
}

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
      var schema_entry = schema.fields.filter((el) => el.name == d[0])[0];

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
        var schema_entry = schema.fields.filter((el) => el.name == td_key);
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

    // // Construct object with row's new data
    // var row_new_data = {};

    // parent_row.selectAll('td.table_field').each(function(d, i, j) {
    //     var td = d3.select(this);

    //     var value = j[i].innerText;
    //     console.log(value);

    //     row_new_data[d[0]] = value

    //     // console.log(d);

    // });
    // console.log(row_new_data);
    // console.log(parent_row);
    // parent_row._groups[0][0].data(row_new_data);
    // // Update <tr>'s __data__ attribute with the row's new data
  }
}

export function update_tr_data() {
  console.log("test");
}

export function parse_data_from_table(e, d) {
  console.log("parse function");

  // Array to populate with data from table
  var parsed_data = [];

  // Selection of (non-header) table rows
  var table_data_rows = d3.selectAll("tr.data_row");
  console.log(table_data_rows);
  console.log(table_data_rows.data());

  d3.selectAll("tr.data_row").each(function (d, i, j) {
    var row_data = {};

    // console.log(j[i]);
    j[i].childNodes.forEach(function (el) {
      if (el.className == "table_field") {
        // Get key and value in cell
        var cell_key = el.getAttribute("key");
        // console.log(cell_key);
        var cell_value = el.innerText;
        // console.log(cell_value);
        // Coerce to correct data type
        var schema_entry = schema.fields.filter((el) => el.name == cell_key);
        var cell_data_type = schema_entry[0] ? schema_entry[0].type : null;
        var valid_values = schema_entry[0] ? schema_entry[0].valid : null;
        // console.log(cell_data_type);

        var typed_cell_value;
        if (cell_data_type == "text") {
          typed_cell_value = cell_value;
        } else if (cell_data_type == "number") {
          console.log(cell_key);
          typed_cell_value = parseFloat(cell_value) || 0;
          console.log(typed_cell_value);
        }
        // else if (cell_data_type == 'date') {typed_cell_value = Date.parse(cell_value).toISOString();}
        else if (cell_data_type == "date") {
          // console.log(cell_value);
          // console.log('====================================')
          var date = new Date(cell_value);
          var month = date.getMonth() + 1;
          var day = date.getDate();
          var year = date.getFullYear();
          typed_cell_value = new Date(`${month}/${day}/${year}`);
          // console.log(typed_cell_value);
          // console.log('====================================')
        }
        // console.log(typed_cell_value);
        row_data[cell_key] = typed_cell_value;

        // console.log(row_data);
      }
    });
    // console.log(row_data);
    parsed_data.push(row_data);
  });
  // console.log(parsed_data);
  return parsed_data;
}

/////////////////////////////////////////////////////////////////////////////
// Old Code
/////////////////////////////////////////////////////////////////////////////

const populate_form = (data) => {
  console.log("populate form");

  var schema = {
    fields: [
      { name: "name", type: "text", display: "Name" },
      { name: "paygrade", type: "text", display: "Paygrade" },
      { name: "station", type: "text", display: "Station" },
      { name: "duty", type: "text", display: "Duty" },
      { name: "start_date", type: "date", display: "Start Date" },
      { name: "end_date", type: "date", display: "End Date" },
      { name: "months", type: "number", display: "Months" },
      { name: "rs_name", type: "text", display: "Reporting Senior Name" },
      {
        name: "rs_paygrade",
        type: "text",
        display: "Reporting Senior Paygrade",
      },
      { name: "rs_title", type: "text", display: "Reporting Senior Title" },

      { name: "trait_1", type: "number", display: "# of 1s" },
      { name: "trait_2", type: "number", display: "# of 2s" },
      { name: "trait_3", type: "number", display: "# of 3s" },
      { name: "trait_4", type: "number", display: "# of 4s" },
      { name: "trait_5", type: "number", display: "# of 5s" },

      { name: "trait_avg", type: "number", display: "Trait Avg" },
      {
        name: "rsca",
        type: "number",
        display: "Reporting Senior Cumulative Avg",
      },
      { name: "prom_rec", type: "text", display: "Promotion Recommendation" },
      { name: "n_sp", type: "number", display: "# SP" },
      { name: "n_pr", type: "number", display: "# PR" },
      { name: "n_p", type: "number", display: "# P" },
      { name: "n_mp", type: "number", display: "# MP" },
      { name: "n_ep", type: "number", display: "# EP" },
      { name: "prt", type: "text", display: "PRT" },
      { name: "rpt_type", type: "text", display: "Report Type" },
    ],
  };

  // Add form header row
  var header = form_div
    .append("div")
    .attr("class", "form_row header")
    .style("display", "flex")
    .selectAll("div")
    .data(schema.fields)
    .enter()
    .append("div")
    .attr("class", "header_items")
    .text((d) => d.display)
    .style("margin", "10px");

  // Add form rows for each FITREP
  //// http://jsfiddle.net/ZRQPP/
  var form_rows = form_div
    .selectAll("div.form_row")
    .data(data)
    .enter()
    .append("div")
    .attr("class", "form_row")
    .style("display", "flex")

    .selectAll("div")
    .data((d) => Object.entries(d))
    .enter()
    .append("div")
    .classed("form_field", true)
    .style("margin", "10px")
    // .text(d => d[1])
    .text((d) => {
      console.log(d);
      var [field, val] = d;
      // var val = d[1];
      var schema_entry = schema.fields.filter((el) => el.name == d[0]);
      // console.log(schema_entry);
      var type = schema_entry[0] ? schema_entry[0].type : null;
      console.log(type);

      if (type == "date") val = lib.date_formatter(d[1]);
      if (field == "trait_avg") {
        console.log(parseFloat(val));
        val = val ? Number.parseFloat(val).toFixed(2) : 0;
      }

      // console.log(d[0]);
      return val;
    });
};

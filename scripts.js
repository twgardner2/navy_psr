"use strict";

import * as lib from "./lib/lib.js";

document.addEventListener("DOMContentLoaded", function () {
  // Create reference to <div> defining the grid
  const grid = d3.select("body").select(".grid");

  // Fitrep SVG canvas and main container groups
  // #region Make page sections
  const svg = grid
    .append("svg")
    .attr("id", "canvas")
    .attr("width", lib.canvas_width)
    .attr("height", lib.canvas_height);

  const container_g = d3
    .select("#canvas")
    .append("g")
    .attr("id", "container_g");

  // Rank bar group
  const rank_g = container_g
    .append("g")
    .attr("id", "rank_g")
    .attr("transform", `translate(${lib.y_axis_width}, ${lib.margin.gap})`);

  // Regular (Active Duty) Commands
  const command_rg_g = container_g
    .append("g")
    .attr("id", "command_rg_g")
    .attr("class", "bar_container")
    .attr(
      "transform",
      `translate(${lib.y_axis_width}, ${lib.bar_height + lib.margin.gap})`
    );
  // Regular (Active Duty) Reporting Seniors
  const rep_sen_rg_g = container_g
    .append("g")
    .attr("id", "rep_sen_rg_g ")
    .attr(
      "transform",
      `translate(${lib.y_axis_width}, ${2 * lib.bar_height + lib.margin.gap})`
    );
  // IDT (SELRES) Commands
  const command_idt_g = container_g
    .append("g")
    .attr("id", "command_idt_g")
    .attr("class", "bar_container")
    .attr(
      "transform",
      `translate(${lib.y_axis_width}, ${3 * lib.bar_height + lib.margin.gap})`
    );
  // IDT (SELRES) Reporting Seniors
  const rep_sen_idt_g = container_g
    .append("g")
    .attr("id", "rep_sen_idt_g ")
    .attr(
      "transform",
      `translate(${lib.y_axis_width}, ${4 * lib.bar_height + lib.margin.gap})`
    );
  // AT (Mobilization/ADSW/ADT) Commands
  const command_at_g = container_g
    .append("g")
    .attr("id", "command_at_g")
    .attr(
      "transform",
      `translate(${lib.y_axis_width}, ${5 * lib.bar_height + lib.margin.gap})`
    );
  // AT (Mobilization/ADSW/ADT) Reporting Seniors
  const rep_sen_at_g = container_g
    .append("g")
    .attr("id", "rep_sen_at_g ")
    .attr(
      "transform",
      `translate(${lib.y_axis_width}, ${6 * lib.bar_height + lib.margin.gap})`
    );

  const fitreps_g = container_g
    .append("g")
    .attr("id", "fitreps_g")
    .attr(
      "transform",
      `translate(${lib.y_axis_width}, ${
        6 * lib.bar_height + 5 * lib.margin.gap
      })`
    );

  // Legend SVG canvas
  const legend_canvas = grid
    .append("div")
    .attr("id", "fitreps_legend")
    .append("svg")
    .attr("width", "100%");

  const rank_bars_label_g = legend_canvas
    .append("g")
    .attr(
      "transform",
      `translate(0, ${lib.margin.gap + 0.5 * lib.bar_height})`
    );
  rank_bars_label_g
    .append("text")
    .text("Rank")
    .style("dominant-baseline", "middle");

  const command_rg_label_g = legend_canvas
    .append("g")
    .attr("transform", `translate(0, ${lib.margin.gap + 1.5 * lib.bar_height})`)
    .append("text")
    .text("Regular Commands")
    .style("dominant-baseline", "middle");

  const rep_sen_rg_label_g = legend_canvas
    .append("g")
    .attr("transform", `translate(0, ${lib.margin.gap + 2.5 * lib.bar_height})`)
    .append("text")
    .text("Regular Reporting Seniors")
    .style("dominant-baseline", "middle");

  const command_idt_label_g = legend_canvas
    .append("g")
    .attr("transform", `translate(0, ${lib.margin.gap + 3.5 * lib.bar_height})`)
    .append("text")
    .text("IDT Commands")
    .style("dominant-baseline", "middle");

  const rep_sen_idt_label_g = legend_canvas
    .append("g")
    .attr("transform", `translate(0, ${lib.margin.gap + 4.5 * lib.bar_height})`)
    .append("text")
    .text("IDT Reporting Seniors")
    .style("dominant-baseline", "middle");

  const command_at_label_g = legend_canvas
    .append("g")
    .attr("transform", `translate(0, ${lib.margin.gap + 5.5 * lib.bar_height})`)
    .append("text")
    .text("AT Commands")
    .style("dominant-baseline", "middle");

  const rep_sen_at_label_g = legend_canvas
    .append("g")
    .attr("transform", `translate(0, ${lib.margin.gap + 6.5 * lib.bar_height})`)
    .append("text")
    .text("AT Reporting Seniors")
    .style("dominant-baseline", "middle");
  // Append rerender button
  const table_container = d3
    .select(".grid")
    .append("div")
    .attr("class", "table");

  const rerender_button = table_container
    .append("div")
    .append("button")
    .text("Re-Render")
    .on("click", function (event) {
      var table_data = lib.parse_data_from_table();
      console.log(table_data);
      console.log("clearing psr...");
      clear_psr_viz(document.getElementById("canvas"));
      console.log("drawing again");
      draw_psr_viz(table_data);
    });

  // Append FITREP table
  const table = table_container.append("table").attr("id", "fitrep_table");

  // #endregion

  // d3.selectAll('#rank, #command, #rep_sen')
  //     .append('defs')
  //     .append('filter')
  //     .attr('id', 'f2')
  //     .attr('width', '150%')
  //     .attr('height', '150%')
  //     .append('feDropShadow');

  const draw_psr_viz = (data) => {
    var fitrep_gaps = lib.fitrep_gaps(data);
    // console.log('fitrep_gaps');
    // console.log(fitrep_gaps);

    // Extract member's name and update H1
    const member_name = data[0].name;
    if (member_name) d3.select("h1").text(`PSR - ${member_name}`);

    const start_dates = data.map((d) => d.start_date);
    const end_dates = data.map((d) => d.end_date);

    var min_start_date = new Date(Math.min(...start_dates));
    var max_end_date = new Date(Math.max(...end_dates));

    const time_scale = d3
      .scaleTime()
      // .domain([Date.now() - 15*365*24*60*60*1000, Date.now()])
      .domain([min_start_date, max_end_date])
      .range([
        0,
        lib.canvas_width -
          lib.y_axis_width -
          lib.margin.left -
          lib.margin.right,
      ]);
    // // FITREP Highlight Interaction
    // function update_highlight_element(e, d, element) {
    //   element
    //     .attr("transform", `translate(${time_scale(d.start)}, 0)`)
    //     .attr("width", `${time_scale(d.end) - time_scale(d.start)}`)
    //     .attr(
    //       "height",
    //       `${lib.rsca_scale.range()[0] - lib.rsca_scale.range()[1]}`
    //     )
    //     .transition()
    //     .duration(200)
    //     .style("opacity", 0.2);
    // }
    // function clear_fitrep_highlight(element_to_clear) {
    //   element_to_clear.style("opacity", 0);
    // }

    // #region FITREP Highlight Hover Rect
    var fitrep_highlight = fitreps_g
      .append("rect")
      .attr("width", "50px")
      .attr("height", "50px")
      .attr("fill", "blue")
      .attr("opacity", 0.0);
    // #endregion

    // Rank Bars
    var dates_of_rank = lib.get_dates_for_values_of_column(data, "paygrade");
    lib.make_bars(
      dates_of_rank,
      rank_g,
      time_scale,
      fitrep_highlight,
      lib.rank_bar_color
    );

    // Regular (Active Duty) Command Bars
    var command_dates = lib.get_dates_for_values_of_column(
      data,
      "station",
      new RegExp("^RG$", "g"),
      "rpt_type"
    );
    lib.make_bars(
      command_dates,
      command_rg_g,
      time_scale,
      fitrep_highlight,
      lib.regular_command_bar_color,
      "white"
    );
    // Regular (Active Duty) Reporting Senior Bars
    var reporting_senior_dates = lib.get_dates_for_values_of_column(
      data,
      "rs_name",
      // new RegExp("^(?!.*(AT|CC)).*$", "g")
      new RegExp("^RG$", "g")
    );
    lib.make_bars(
      reporting_senior_dates,
      rep_sen_rg_g,
      time_scale,
      fitrep_highlight,
      lib.regular_command_bar_color,
      "white"
    );
    // IDT (SELRES) Command Bars
    var idt_command_dates = lib.get_dates_for_values_of_column(
      data,
      "station",
      new RegExp("^IDT", "g"),
      "rpt_type"
    );
    lib.make_bars(
      idt_command_dates,
      command_idt_g,
      time_scale,
      fitrep_highlight,
      lib.idt_command_bar_color,
      "white"
    );
    // IDT (SELRES) Reporting Senior Bars
    var idt_reporting_senior_dates = lib.get_dates_for_values_of_column(
      data,
      "rs_name",
      // new RegExp("^(?!.*(AT|CC)).*$", "g")
      new RegExp("^IDT", "g")
    );
    lib.make_bars(
      idt_reporting_senior_dates,
      rep_sen_idt_g,
      time_scale,
      fitrep_highlight,
      lib.idt_command_bar_color,
      "white"
    );
    // AT (Mobilization/ADSW/ADT) Command Bars
    var at_command_dates = lib.get_dates_for_values_of_column(
      data,
      "station",
      new RegExp("(AT|CC)", "g"),
      "rpt_type"
    );
    lib.make_bars(
      at_command_dates,
      command_at_g,
      time_scale,
      fitrep_highlight,
      lib.at_cc_command_bar_color
    );
    // AT (Mobilization/ADSW/ADT) Reporting Senior Bars
    var at_reporting_senior_dates = lib.get_dates_for_values_of_column(
      data,
      "rs_name",
      new RegExp("(AT|CC)", "g")
    );
    lib.make_bars(
      at_reporting_senior_dates,
      rep_sen_at_g,
      time_scale,
      fitrep_highlight,
      lib.at_cc_command_bar_color
    );

    // FITREPs

    // #region Add FITREP plot legend
    // 2 groups in the legend canvas, 1 for the promotion recommendation legend, 1 for the traffic size legend
    const prom_rec_g = legend_canvas
      .append("g")
      .attr("transform", `translate(10,${8 * lib.bar_height})`);
    const traffic_g = legend_canvas
      .append("g")
      .attr("transform", `translate(100,${8 * lib.bar_height})`);

    // Draw the promotion recommendation legend
    /// Groups
    const prom_rec_legend_marker_groups = prom_rec_g
      .selectAll("g")
      .data(lib.prom_rec_categories)
      .enter()
      .append("g")
      .attr(
        "transform",
        (d, i) =>
          `translate(0, ${
            i *
            1.2 *
            Math.sqrt(
              (4 * lib.fitrep_marker_size(lib.fitrep_legend_marker_size)) /
                Math.PI
            )
          })`
      );
    /// Markers
    prom_rec_legend_marker_groups
      .append("path")
      .attr("d", function (d) {
        var symbol = lib.fitrep_shape_scale(d.toUpperCase());
        var size = lib.fitrep_marker_size(lib.fitrep_legend_marker_size);
        return symbol.size(size)();
      })
      .attr("fill", (d) => lib.fitrep_color_scale(d.toUpperCase()))
      .attr("opacity", lib.fitrep_marker_opacity);
    /// Marker outlines
    prom_rec_legend_marker_groups
      .append("path")
      .attr("d", function (d) {
        var symbol = lib.fitrep_shape_scale(d.toUpperCase());
        var size = lib.fitrep_marker_size(lib.fitrep_legend_marker_size);
        return symbol.size(size)();
      })
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", lib.fitrep_marker_stroke_width);
    /// Labels
    prom_rec_legend_marker_groups
      .append("text")
      .attr(
        "transform",
        `translate(${
          1.1 *
          Math.sqrt(
            (4 * lib.fitrep_marker_size(lib.fitrep_legend_marker_size)) /
              Math.PI
          )
        })`
      )
      .text((d) => d)
      .attr("dominant-baseline", "central");

    // Draw the "traffic" legend
    /// Groups
    const fitrep_traffic_legend_marker_groups = traffic_g
      .selectAll("g")
      .data(lib.fitrep_traffic_legend_sizes)
      .enter()
      .append("g")
      .attr(
        "transform",
        (d, i) =>
          `translate(0, ${
            i *
            1.2 *
            Math.sqrt(
              (4 *
                lib.fitrep_marker_size(
                  Math.max(...lib.fitrep_traffic_legend_sizes)
                )) /
                Math.PI
            )
          })`
      );
    /// Markers
    fitrep_traffic_legend_marker_groups
      .append("path")
      .attr("d", function (d) {
        var symbol = d3.symbol(d3.symbolCircle);
        var size = lib.fitrep_marker_size(d);
        return symbol.size(size)();
      })
      // .attr("fill", (d) => lib.fitrep_color_scale("EP"))
      .attr("fill", (d) => "none")
      .attr("opacity", lib.fitrep_marker_opacity);
    /// Marker outlines
    fitrep_traffic_legend_marker_groups
      .append("path")
      .attr("d", function (d) {
        var symbol = d3.symbol(d3.symbolCircle);
        var size = lib.fitrep_marker_size(d);
        return symbol.size(size)();
      })
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", lib.fitrep_marker_stroke_width);
    /// Labels
    fitrep_traffic_legend_marker_groups
      .append("text")
      .attr(
        "transform",
        `translate(${
          1.1 *
          Math.sqrt(
            (4 * lib.fitrep_marker_size(lib.fitrep_legend_marker_size)) /
              Math.PI
          )
        })`
      )
      .text((d) => d)
      .attr("dominant-baseline", "central");

    // #endregion

    // #region Draw FITREPs plot
    // Create tooltip
    var tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("border-style", "solid")
      .style("opacity", 0)
      .style("pointer-events", "none");
    // Draw time axis
    fitreps_g
      .append("g")
      .attr("class", "x axis")
      .attr(
        "transform",
        `translate(0, ${lib.fitrep_height - lib.rsca_scale(0)})`
      )
      .call(d3.axisBottom(time_scale));

    // Draw 'Trait Avg - RSCA' axis
    fitreps_g
      .append("g")
      .attr("class", "y axis")
      .attr("transform", `translate(${time_scale(min_start_date)}, 0)`)
      .call(d3.axisLeft(lib.rsca_scale));

    fitreps_g.on("mouseenter", function () {
      clear_fitrep_highlight(fitrep_highlight);
    });

    // Append FITREP marker groups
    const fitrep_marker_gs = fitreps_g
      .selectAll("g.fitrep")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "fitrep dot")
      .attr("transform", function (d) {
        return `translate(${time_scale(
          d.end_date
        )}, ${lib.rsca_scale(d.trait_avg - d.rsca)})`;
      });
    // Draw FITREP markers
    fitrep_marker_gs
      .append("path")
      .attr("d", function (d) {
        var symbol = lib.fitrep_shape_scale(d.prom_rec.toUpperCase());
        var size = lib.fitrep_marker_size(
          d.n_sp + d.n_pr + d.n_p + d.n_mp + d.n_ep
        );
        return symbol.size(size)();
      })
      .attr("fill", (d) => lib.fitrep_color_scale(d.prom_rec.toUpperCase()))
      .attr("opacity", lib.fitrep_marker_opacity)
      .on("mouseover", function (event, d) {
        tooltip.transition().duration(400).style("opacity", 0.9);
        tooltip
          .html(lib.fitrep_tooltip(d))
          .style("left", event.pageX + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", function (d) {
        tooltip.transition().duration(400).style("opacity", 0);
      });
    // Draw FITREP marker outlines
    fitrep_marker_gs
      .append("path")
      .attr("d", function (d) {
        var symbol = lib.fitrep_shape_scale(d.prom_rec.toUpperCase());
        var size = lib.fitrep_marker_size(
          d.n_sp + d.n_pr + d.n_p + d.n_mp + d.n_ep
        );
        return symbol.size(size)();
      })
      .attr("fill", "none")
      .attr("stroke", (d) => lib.fitrep_color_scale(d.prom_rec.toUpperCase()))
      .attr("stroke", (d) => "black")
      .attr("stroke-width", lib.fitrep_marker_stroke_width)
      .attr("opacity", 1)
      .on("mouseover", function (event, d) {
        tooltip.transition().duration(400).style("opacity", 0.9);
        tooltip
          .html(lib.fitrep_tooltip(d))
          .style("left", event.pageX + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", function (d) {
        tooltip.transition().duration(400).style("opacity", 0);
      });

    // Draw comparable FITREP lines
    var comparable_fitreps = lib.fitreps_grouped_by_paygrade_and_repsen(data);

    const line = d3
      .line()
      .x((d) => time_scale(d.end_date))
      .y((d) => lib.rsca_scale(d.trait_avg - d.rsca));

    fitreps_g
      .selectAll("lines")
      .data(comparable_fitreps)
      .enter()
      .append("g")
      .attr("class", "fitrep line")
      .append("path")
      .attr("d", (d) => line(d))
      .attr("fill", "none")
      .attr("stroke", "#000")
      .attr("stroke-width", "2.5px")
      .attr("opacity", 0.5)
      .attr("pointer-events", "none");

    // Draw dotted line for same Reporting Senior, different Rank
    var fitreps_same_rs_new_rank = lib.fitreps_same_rs_new_rank(data);
    console.log(fitreps_same_rs_new_rank);

    fitreps_g
      .selectAll("lines")
      .data(fitreps_same_rs_new_rank)
      .enter()
      .append("g")
      .attr("class", "fitrep line")
      .append("path")
      .attr("d", (d) => line(d))
      .attr("fill", "none")
      .attr("stroke", "#000")
      .attr("stroke-width", "2.5px")
      .attr("opacity", 0.5)
      .attr("stroke-dasharray", "5,3")
      .attr("pointer-events", "none");

    // FITREP Gaps
    fitreps_g
      .append("g")
      .attr("class", "fitrep gap")
      .selectAll("rect")
      .data(fitrep_gaps)
      .enter()
      .append("rect")
      .attr("transform", (d) => `translate(${time_scale(d[0])},0)`)
      .attr("height", lib.rsca_scale.range()[0])
      .attr("width", (d) => `${time_scale(d[1]) - time_scale(d[0])}px`)
      .attr("fill", "red")
      .attr("opacity", 0.2)
      .style("pointer-events", "none");
    // #endregion
  };

  const populate_table = (data) => {
    // Add form header row
    var header = table
      .append("tr")
      .attr("class", "table_row header")
      // .style('border-collapse', 'collapse')
      .selectAll("th")
      .data(lib.schema.fields)
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
        var schema_entry = lib.schema.fields.filter((el) => el.name == d[0]);
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
      .on("click", lib.toggle_rows);
  };

  const clear_psr_viz = () => {
    d3.select(canvas).select("#rank_g").selectAll("g").remove();

    d3.select(canvas).select("#command_rg_g").selectAll("g").remove();

    d3.select(canvas).select("#rep_sen_rg_g").selectAll("g").remove();

    d3.select(canvas).select("#command_at_g").selectAll("g").remove();

    d3.select(canvas)
      // .select('#command_at_g')
      .selectAll("g.fitrep")
      .remove();

    d3.select(canvas).selectAll("g.x.axis").remove();

    d3.select(canvas).selectAll("g.y.axis").remove();
  };

  const data = d3
    .csv("./gardner_anon.csv", d3.autoType)
    .then((data) => {
      // Attach original data to ghost <g> to retain it
      d3.select("body")
        .append("g")
        .attr("id", "original_data")
        .attr("original_data", data)
        .data(data);

      // Log data to console
      // console.log(data);
      return data;
    })
    .then((data) => {
      // Build table with PSR data
      populate_table(data);
      return data;
    })
    // Draw viz
    .then((data) => draw_psr_viz(data));
});

"use strict";

import * as d3 from "d3";

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

// Formatters
export const date_formatter = new Intl.DateTimeFormat("en-US").format;
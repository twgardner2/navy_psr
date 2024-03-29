'use strict';

import * as d3 from 'd3';

// Sizing variables
export const canvas_width = 1500;
export const canvas_height = 650;
export const margin = { top: 30, right: 30, bottom: 30, left: 30, gap: 10 };

export const y_axis_width = 20;

export const bar_width = 1000;
export const bar_gap = 40;
export const bar_height = 0.8 * bar_gap;

export const fitrep_width = 1000;
export const fitrep_height = 300;

export const sample_name="SAMPLE-I-AM"

// Horizontal (time) scale - defined in scripts.js

// Vertical (RSCA) scale
export const rsca_scale_max = 1.2;
export const rsca_scale_min = -1.2;
export const rsca_scale = d3
    .scaleLinear()
    .domain([rsca_scale_min, rsca_scale_max])
    .range([fitrep_height, 0]);

// Colors
export const bg_color = '#e5e4e2';
export const rank_bar_color = '#c6ccd0';
export const regular_command_bar_color = '#003b4f';
export const idt_command_bar_color = '#088199';
export const at_cc_command_bar_color = '#e8b00f';

// FITREP marker styling
export const prom_rec_categories = [
    'EP',
    'MP',
    'P',
    'PR',
    'SP',
    'NOB',
    'Missing RSCA',
];
export const fitrep_traffic_legend_sizes = [1, 3, 5, 10, 15];

export const ep_color = '#48ff00';
export const mp_color = '#3498db';
export const p_color = 'black';
export const pr_color = 'yellow';
export const sp_color = 'red';
export const nob_color = 'white';
export const missing_rsca_color = 'white';
export const fitrep_traffic_legend_marker_color = 'white';

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

export const gap_legend_height = 60;
export const gap_legend_width = 30;
export const gap_color = 'red';
export const gap_opacity = 0.2;

export const fitrep_tooltip_opacity = 0.85;
export const fitrep_gap_tooltip_opacity = 0.85;

export const fitrep_color_scale = d3
    .scaleOrdinal()
    .domain(['EP', 'MP', 'P', 'PR', 'SP', 'NOB', 'MISSING RSCA'])
    .range([
        ep_color,
        mp_color,
        p_color,
        pr_color,
        sp_color,
        nob_color,
        missing_rsca_color,
    ]);

export const fitrep_stroke_scale = d3
    .scaleOrdinal()
    .domain(['EP', 'MP', 'P', 'PR', 'SP', 'NOB', 'MISSING RSCA'])
    .range(['black', 'black', 'black', 'black', 'black', 'black', 'red']);

export const fitrep_shape_scale = d3
    .scaleOrdinal()
    .domain(['EP', 'MP', 'P', 'PR', 'SP', 'NOB', 'Missing RSCA'])
    .range([
        ep_shape,
        mp_shape,
        p_shape,
        pr_shape,
        sp_shape,
        nob_shape,
        nob_shape,
    ]);

export const fitrep_marker_size = d3
    .scaleLinear()
    .domain([1, 15])
    .range([50, 350])
    .clamp(true);

// Formatters
export const dateFormatter_mmddyyyy = new Intl.DateTimeFormat('en-US').format;
export const dateFormatter_mmddyy = new Intl.DateTimeFormat('en-US', {
    year: '2-digit',
    month: 'numeric',
    day: 'numeric',
}).format;

// Helpers
export function add_days_to_date(date, n_days) {
    var days_in_ms = n_days * 24 * 3600 * 1000;
    return new Date(date.getTime() + days_in_ms);
}

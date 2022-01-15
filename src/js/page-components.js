import * as lib from './lib.js';
import * as d3 from 'd3';

let svg,
    container_g,
    rank_g,
    command_rg_g,
    rep_sen_rg_g,
    command_idt_g,
    rep_sen_idt_g,
    command_at_g,
    rep_sen_at_g,
    fitreps_g,
    legend_canvas,
    table,
    rerender_button,
    table_container;

export const getPageElements = () => ({
    rank_g,
    command_rg_g,
    rep_sen_rg_g,
    command_idt_g,
    rep_sen_idt_g,
    command_at_g,
    rep_sen_at_g,
    fitreps_g,
    legend_canvas,
    rerender_button,
});

export const buildElements = (grid) => {
    buildGraph(grid);

    // Legend SVG canvas
    legend_canvas = grid
        .append('div')
        .attr('id', 'fitreps_legend')
        .append('svg')
        .attr('width', '100%');

    table_container = grid.append('div').attr('class', 'table');

    rerender_button = table_container
        .append('div')
        .append('button')
        .text('Re-Render');

    return getPageElements();
};

export function resetGraph(grid) {
    svg.remove();
    buildGraph(grid);
}

function buildGraph(grid) {
    svg = grid
        .append('svg')
        .attr('id', 'canvas')
        .attr('width', lib.canvas_width)
        .attr('height', lib.canvas_height);

    container_g = svg.append('g').attr('id', 'container_g');

    rank_g = container_g
        .append('g')
        .attr('id', 'rank_g')
        .attr('transform', `translate(${lib.y_axis_width}, ${lib.margin.gap})`);

    // Regular (Active Duty) Commands
    command_rg_g = container_g
        .append('g')
        .attr('id', 'command_rg_g')
        .attr('class', 'bar_container')
        .attr(
            'transform',
            `translate(${lib.y_axis_width}, ${lib.bar_height + lib.margin.gap})`
        );
    // Regular (Active Duty) Reporting Seniors
    rep_sen_rg_g = container_g
        .append('g')
        .attr('id', 'rep_sen_rg_g')
        .attr(
            'transform',
            `translate(${lib.y_axis_width}, ${
                2 * lib.bar_height + lib.margin.gap
            })`
        );
    // IDT (SELRES) Commands
    command_idt_g = container_g
        .append('g')
        .attr('id', 'command_idt_g')
        .attr('class', 'bar_container')
        .attr(
            'transform',
            `translate(${lib.y_axis_width}, ${
                3 * lib.bar_height + lib.margin.gap
            })`
        );
    // IDT (SELRES) Reporting Seniors
    rep_sen_idt_g = container_g
        .append('g')
        .attr('id', 'rep_sen_idt_g')
        .attr(
            'transform',
            `translate(${lib.y_axis_width}, ${
                4 * lib.bar_height + lib.margin.gap
            })`
        );
    // AT (Mobilization/ADSW/ADT) Commands
    command_at_g = container_g
        .append('g')
        .attr('id', 'command_at_g')
        .attr(
            'transform',
            `translate(${lib.y_axis_width}, ${
                5 * lib.bar_height + lib.margin.gap
            })`
        );
    // AT (Mobilization/ADSW/ADT) Reporting Seniors
    rep_sen_at_g = container_g
        .append('g')
        .attr('id', 'rep_sen_at_g')
        .attr(
            'transform',
            `translate(${lib.y_axis_width}, ${
                6 * lib.bar_height + lib.margin.gap
            })`
        );
    fitreps_g = container_g
        .append('g')
        .attr('id', 'fitreps_g')
        .attr(
            'transform',
            `translate(${lib.y_axis_width}, ${
                6 * lib.bar_height + 5 * lib.margin.gap
            })`
        );
}

export function resetTable() {
    if (table) {
        table.remove();
    }
    table = table_container.append('table').attr('id', 'fitrep_table');
    return table;
}

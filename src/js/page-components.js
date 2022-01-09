import * as lib from "./lib.js";
import * as d3 from "d3";

let svg,
    container_g,
    rank_g,
    command_g,
    rep_sen_g,
    command_cc_g,
    rep_sen_cc_g,
    fitreps_g,
    legend_canvas,
    table,
    rerender_button,
    table_container;


export const getPageElements= ()=>({
    rank_g,
    command_g,
    rep_sen_g,
    command_cc_g,
    rep_sen_cc_g,
    fitreps_g,
    legend_canvas,
    rerender_button,
});

export const buildElements= (grid)=>{  

    buildGraph(grid);

    // Legend SVG canvas
    legend_canvas = grid
    .append("div")
    .attr("id", "fitreps_legend")
    .append("svg")
    .attr("width", "100%");

    
    table_container = grid
    .append("div")
    .attr("class", "table");

    
    rerender_button = table_container
    .append("div")
    .append("button")
    .text("Re-Render")

    return getPageElements()
}


export function resetGraph(grid){
    svg.remove();
    buildGraph(grid);
}

function buildGraph(grid){
    svg = grid
    .append("svg")
    .attr("id", "canvas")
    .attr("width", lib.canvas_width)
    .attr("height", lib.canvas_height);

    container_g = svg
    .append("g")
    .attr("id", "container_g");

    rank_g = container_g
    .append("g")
    .attr("id", "rank_g")
    .attr("transform", `translate(${lib.y_axis_width}, ${lib.margin.gap})`);

    command_g = container_g
    .append("g")
    .attr("id", "command_g")
    .attr("class", "bar_container")
    .attr(
    "transform",
    `translate(${lib.y_axis_width}, ${lib.bar_height + lib.margin.gap})`
    );

    rep_sen_g = container_g
    .append("g")
    .attr("id", "rep_sen_g ")
    .attr(
    "transform",
    `translate(${lib.y_axis_width}, ${2 * lib.bar_height + lib.margin.gap})`
    );

    command_cc_g = container_g
    .append("g")
    .attr("id", "command_cc_g")
    .attr(
    "transform",
    `translate(${lib.y_axis_width}, ${
        3 * lib.bar_height + 3 * lib.margin.gap
    })`
    );

    rep_sen_cc_g = container_g
    .append("g")
    .attr("id", "rep_sen_cc_g ")
    .attr(
    "transform",
    `translate(${lib.y_axis_width}, ${
        4 * lib.bar_height + 3 * lib.margin.gap
    })`
    );

    fitreps_g = container_g
    .append("g")
    .attr("id", "fitreps_g")
    .attr(
    "transform",
    `translate(${lib.y_axis_width}, ${
        6 * lib.bar_height + 5 * lib.margin.gap
    })`
    );
}

export function resetTable(){
    if(table){
        table.remove();
    }
    table = table_container.append("table").attr("id", "fitrep_table");
    return table;
}

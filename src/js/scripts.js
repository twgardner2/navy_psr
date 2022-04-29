import * as lib from './lib.js';
import * as d3 from 'd3';

const { DataProvider } = require('./data/providers/DataProvider');
const { parse_data_from_table } = require('./data/parsers/table/table-parser');

const {
    buildElements,
    draw_legend,
    addHTMLTemplates,
    addNavBar,
} = require('./page-components.js');
const { populate_table } = require('./table/table.js');
const { clear_psr_viz, draw_psr_viz } = require('./graph/graph.js');

const { appendPDFUploadForm } = require('./pdf-form.js');

let data;

document.addEventListener('DOMContentLoaded', function () {
    addNavBar();
    // ^^^ Navbar ^^^

    d3.select('body').style('background-color', lib.bg_color);

    let grid = d3.select('body').select('.grid');

    appendPDFUploadForm(grid);

    const { rerender_button } = buildElements(grid);

    rerender_button.on('click', function (event) {
        var table_data = parse_data_from_table();
        clear_psr_viz(document.getElementById('canvas'));
        let provider = new DataProvider(table_data);
        draw_psr_viz(provider);
    });

    d3.select('#start-date').on('change', function (event) {
        rerender_button.node().click();
    });

    draw_legend();
    
    let sampleData=require('../../sample_psr.json');
    // Attach original data to ghost <g> to retain it
    d3.select('body')
        .append('g')
        .attr('id', 'original_data')
        .attr('original_data', sampleData)
        .data(sampleData);

        let provider = new DataProvider(sampleData);
            populate_table(provider);
        
        draw_psr_viz(provider);

    addHTMLTemplates();
});

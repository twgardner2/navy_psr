import * as lib from './lib.js';
import * as d3 from 'd3';

const { DataProvider } = require('./data/providers/DataProvider');
const { parse_data_from_table } = require('./data/parsers/table/table-parser');

const { buildElements } = require('./page-components.js');
const { populate_table } = require('./table/table.js');
const { clear_psr_viz, draw_psr_viz } = require('./graph/graph.js');

const { appendPDFUploadForm } = require('./pdf-form.js');

let data;

document.addEventListener('DOMContentLoaded', function () {
    let grid = d3.select('body').select('.grid');

    appendPDFUploadForm(grid);

    const { rerender_button } = buildElements(grid);

    rerender_button.on('click', function (event) {
        var table_data = parse_data_from_table();
        clear_psr_viz(document.getElementById('canvas'));
        let provider = new DataProvider(table_data);
        draw_psr_viz(provider);
    });

    let data = d3
        .csv('./gardner_anon.csv', d3.autoType)
        .then((data) => {
            // Attach original data to ghost <g> to retain it
            d3.select('body')
                .append('g')
                .attr('id', 'original_data')
                .attr('original_data', data)
                .data(data);

            // Log data to console
            // console.log(data);
            return data;
        })
        .then((data) => {
            let provider = new DataProvider(data);
            populate_table(provider);
            return provider;
        })
        // Draw viz
        .then((provider) => draw_psr_viz(provider));
});

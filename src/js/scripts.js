import * as lib from './lib.js';
import * as d3 from 'd3';
import { appendMultiNameSelect } from './view/record-selector.js';
import { DataLoader } from './data/providers/DataLoader.js';
import { DataProvider } from './data/providers/DataProvider.js';

const { parse_data_from_table } = require('./data/parsers/table/table-parser');

const {
    buildElements,
    draw_legend,
    addNavBar,
    addTabs,
    addViewToggle
} = require('./view/page-components.js');

const { appendPDFUploadForm } = require('./view/pdf-form.js');

let data;

document.addEventListener('DOMContentLoaded', function () {
    addNavBar();
    addTabs()

    d3.select('body').style('background-color', lib.bg_color);

    let grid = d3.select('body').select('.grid');

    appendMultiNameSelect(grid);
    appendPDFUploadForm(grid);
    addViewToggle();

    const { rerender_button } = buildElements(grid);

    rerender_button.on('click', function (event) {
        var table_data = parse_data_from_table();
        let provider=new DataProvider();
        provider.updateActiveRecord(table_data);

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

        let loader= new DataLoader(sampleData);
        loader.setRecordName("Sample");
        loader.load();

        
});

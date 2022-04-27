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

    let previousScrollPosition = 0;

    function openFaq() {
        console.log('open faq overlay');
        // document.getElementById('faq').style.height = '100%';
        document.querySelector('.overlay').style.height = '100%';
    }
    function closeFaq() {
        console.log('close faq overlay');
        document.querySelector('.overlay').style.height = '0%';
    }

    const faqLink = document.getElementById('faqLink');
    faqLink.addEventListener('click', openFaq);

    const faqCloseBtn = document.getElementById('faqCloseBtn');
    faqCloseBtn.addEventListener('click', closeFaq);

    // Navbar
    const isScrollingDown = () => {
        let currentScrolledPosition = window.scrollY || window.pageYOffset;
        let scrollingDown;

        if (currentScrolledPosition > previousScrollPosition) {
            scrollingDown = true;
        } else {
            scrollingDown = false;
        }
        previousScrollPosition = currentScrolledPosition;
        return scrollingDown;
    };
    const nav = document.querySelector('nav');
    const handleNavScroll = () => {
        if (isScrollingDown()) {
            nav.classList.add('scroll-down');
            nav.classList.remove('scroll-up');
        } else {
            nav.classList.add('scroll-up');
            nav.classList.remove('scroll-down');
        }
    };

    window.addEventListener('scroll', () => {
        // throttle(handleNavScroll, 250);
        handleNavScroll();
    });

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

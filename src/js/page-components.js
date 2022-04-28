import * as lib from './lib.js';
import * as d3 from 'd3';
import flatpickr from 'flatpickr';

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
    table_container,
    fp_start_date;

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
    fp_start_date,
});

export const buildElements = (grid) => {
    buildGraph(grid);

    // Legend SVG canvas
    legend_canvas = grid
        .append('div')
        .attr('id', 'fitrep_legend')
        .append('svg')
        .attr('width', '100%');

    table_container = grid.append('div').attr('class', 'table');

    let start_container = table_container
        .append('div')
        .attr('class', 'graph_filter_container');

    start_container
        .append('label')
        .attr('for', 'start_date')
        .html('Start Date:');

    start_container
        .append('input')
        .attr('type', 'text')
        .attr('id', 'start-date');

    rerender_button = table_container
        .append('div')
        .append('button')
        .attr('id', 'rerender-btn')
        .text('Re-Render')
        .style('display', 'none');

    fp_start_date = flatpickr('#start-date', {
        position: 'above left',
        dateFormat: 'm/d/Y',
    });

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
            `translate(${lib.y_axis_width}, ${lib.bar_gap + lib.margin.gap})`
        );
    // Regular (Active Duty) Reporting Seniors
    rep_sen_rg_g = container_g
        .append('g')
        .attr('id', 'rep_sen_rg_g')
        .attr(
            'transform',
            `translate(${lib.y_axis_width}, ${
                2 * lib.bar_gap + lib.margin.gap
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
                3 * lib.bar_gap + lib.margin.gap
            })`
        );
    // IDT (SELRES) Reporting Seniors
    rep_sen_idt_g = container_g
        .append('g')
        .attr('id', 'rep_sen_idt_g')
        .attr(
            'transform',
            `translate(${lib.y_axis_width}, ${
                4 * lib.bar_gap + lib.margin.gap
            })`
        );
    // AT (Mobilization/ADSW/ADT) Commands
    command_at_g = container_g
        .append('g')
        .attr('id', 'command_at_g')
        .attr(
            'transform',
            `translate(${lib.y_axis_width}, ${
                5 * lib.bar_gap + lib.margin.gap
            })`
        );
    // AT (Mobilization/ADSW/ADT) Reporting Seniors
    rep_sen_at_g = container_g
        .append('g')
        .attr('id', 'rep_sen_at_g')
        .attr(
            'transform',
            `translate(${lib.y_axis_width}, ${
                6 * lib.bar_gap + lib.margin.gap
            })`
        );
    fitreps_g = container_g
        .append('g')
        .attr('id', 'fitreps_g')
        .attr(
            'transform',
            `translate(${lib.y_axis_width}, ${
                6 * lib.bar_gap + 5 * lib.margin.gap
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

// FITREPs Legend
export function draw_legend() {
    const { legend_canvas } = getPageElements();

    // #region Add FITREP plot legend
    // 4 groups in the legend canvas: promotion recommendation legend,
    // traffic size legend, gap legend, y-axis label
    const prom_rec_g = legend_canvas
        .append('g')
        .attr('transform', `translate(10,${8 * lib.bar_gap})`);
    const traffic_g = legend_canvas
        .append('g')
        .attr('transform', `translate(100,${8 * lib.bar_gap})`);
    const gap_g = legend_canvas
        .append('g')
        .attr(
            'transform',
            `translate(10,${
                8 * lib.bar_gap +
                lib.prom_rec_categories.length *
                    1.2 *
                    Math.sqrt(
                        (4 *
                            lib.fitrep_marker_size(
                                lib.fitrep_legend_marker_size
                            )) /
                            Math.PI
                    )
            })`
        );
    const axisLabel_g = legend_canvas
        .append('g')
        .attr('transform', `translate(180,430) rotate(270)`);

    // Draw the promotion recommendation legend
    /// Markers
    const prom_rec_legend_marker_groups = prom_rec_g
        .selectAll('g')
        .data(lib.prom_rec_categories)
        .enter()
        .append('g')
        .attr(
            'transform',
            (d, i) =>
                `translate(0, ${
                    i *
                    1.2 *
                    Math.sqrt(
                        (4 *
                            lib.fitrep_marker_size(
                                lib.fitrep_legend_marker_size
                            )) /
                            Math.PI
                    )
                })`
        );
    /// Marker fill
    prom_rec_legend_marker_groups
        .append('path')
        .attr('d', function (d) {
            var symbol = lib.fitrep_shape_scale(d.toUpperCase());
            var size = lib.fitrep_marker_size(lib.fitrep_legend_marker_size);
            return symbol.size(size)();
        })
        .attr('fill', (d) => lib.fitrep_color_scale(d.toUpperCase()))
        .attr('opacity', lib.fitrep_marker_opacity);
    /// Marker outlines
    prom_rec_legend_marker_groups
        .append('path')
        .attr('d', function (d) {
            var symbol = lib.fitrep_shape_scale(d.toUpperCase());
            var size = lib.fitrep_marker_size(lib.fitrep_legend_marker_size);
            return symbol.size(size)();
        })
        .attr('fill', 'none')
        .attr('stroke', (d) => lib.fitrep_stroke_scale(d.toUpperCase()))
        .attr('stroke-width', lib.fitrep_marker_stroke_width);
    /// Labels
    prom_rec_legend_marker_groups
        .append('text')
        .attr(
            'transform',
            `translate(${
                1.1 *
                Math.sqrt(
                    (4 *
                        lib.fitrep_marker_size(lib.fitrep_legend_marker_size)) /
                        Math.PI
                )
            },5)`
        )
        .text((d) => d);

    // Draw the "traffic" legend
    /// Markers
    const fitrep_traffic_legend_marker_groups = traffic_g
        .selectAll('g')
        .data(lib.fitrep_traffic_legend_sizes)
        .enter()
        .append('g')
        .attr(
            'transform',
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
        .append('path')
        .attr('d', function (d) {
            var symbol = d3.symbol(d3.symbolCircle);
            var size = lib.fitrep_marker_size(d);
            return symbol.size(size)();
        })
        .attr('fill', (d) => lib.fitrep_traffic_legend_marker_color)
        .attr('opacity', lib.fitrep_marker_opacity);
    /// Marker outlines
    fitrep_traffic_legend_marker_groups
        .append('path')
        .attr('d', function (d) {
            var symbol = d3.symbol(d3.symbolCircle);
            var size = lib.fitrep_marker_size(d);
            return symbol.size(size)();
        })
        .attr('fill', 'none')
        .attr('stroke', 'black')
        .attr('stroke-width', lib.fitrep_marker_stroke_width);
    /// Labels
    fitrep_traffic_legend_marker_groups
        .append('text')
        .attr(
            'transform',
            `translate(${
                1.1 *
                Math.sqrt(
                    (4 *
                        lib.fitrep_marker_size(lib.fitrep_legend_marker_size)) /
                        Math.PI
                )
            },5)`
        )
        .text((d) => d);

    // Draw the FITREP gap legend
    gap_g
        .append('rect')
        .attr('height', `${lib.gap_legend_height}px`)
        .attr('width', `${lib.gap_legend_width}px`)
        .attr('fill', lib.gap_color)
        .attr('opacity', lib.gap_opacity);
    gap_g
        .append('text')
        .selectAll('tspan')
        .data(['FITREP', 'Continuity', 'Gap'])
        .enter()
        .append('tspan')
        .text((d) => d)
        .attr('x', '40px')
        .attr('y', (d, i) => `${50 + i * 16}px`);

    // Draw the y-axis label
    axisLabel_g
        .append('text')
        .attr('text-anchor', `middle`)
        .text('Trait Average - RSCA');
    // #endregion

    const command_rg_label_g = legend_canvas
        .append('g')
        .attr(
            'transform',
            `translate(0, ${lib.margin.gap + 1.5 * lib.bar_gap})`
        )
        .append('text')
        .text('Regular Commands')
        .style('dominant-baseline', 'middle');

    const rep_sen_rg_label_g = legend_canvas
        .append('g')
        .attr(
            'transform',
            `translate(0, ${lib.margin.gap + 2.5 * lib.bar_gap})`
        )
        .append('text')
        .text('Regular Reporting Seniors')
        .style('dominant-baseline', 'middle');

    const command_idt_label_g = legend_canvas
        .append('g')
        .attr(
            'transform',
            `translate(0, ${lib.margin.gap + 3.5 * lib.bar_gap})`
        )
        .append('text')
        .text('IDT Commands')
        .style('dominant-baseline', 'middle');

    const rep_sen_idt_label_g = legend_canvas
        .append('g')
        .attr(
            'transform',
            `translate(0, ${lib.margin.gap + 4.5 * lib.bar_gap})`
        )
        .append('text')
        .text('IDT Reporting Seniors')
        .style('dominant-baseline', 'middle');

    const command_at_label_g = legend_canvas
        .append('g')
        .attr(
            'transform',
            `translate(0, ${lib.margin.gap + 5.5 * lib.bar_gap})`
        )
        .append('text')
        .text('AT Commands')
        .style('dominant-baseline', 'middle');

    const rep_sen_at_label_g = legend_canvas
        .append('g')
        .attr(
            'transform',
            `translate(0, ${lib.margin.gap + 6.5 * lib.bar_gap})`
        )
        .append('text')
        .text('AT Reporting Seniors')
        .style('dominant-baseline', 'middle');
}

export function addHTMLTemplates() {
    let templates = ['nav'];

    templates.map((filename) =>
        d3
            .select('body')
            .append('div')
            .attr('id', filename)
            .html(require(`../templates/${filename}.html`).default)
    );
}

export function addNavBar() {
    console.log('adding navbar');
    d3.select('nav')
        .attr('id', 'nav')
        .html(require('../templates/nav.html').default);

    
        let previousScrollPosition = 0;

        function openFaq() {
            document.querySelector('.overlay').classList.add('open');
        }
        function closeFaq() {
            console.log('close faq overlay');
            document.querySelector('.overlay').classList.remove('open');
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
            handleNavScroll();
        });
}

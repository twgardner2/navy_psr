import * as d3 from 'd3';
import * as lib from '../lib';

const { getPageElements } = require('../page-components');

let fitrep_highlight;

export const clear_psr_viz = (canvas) => {
    d3.select(canvas).select('#rank_g').selectAll('g').remove();

    d3.select(canvas).select('#command_rg_g').selectAll('g').remove();

    d3.select(canvas).select('#rep_sen_rg_g').selectAll('g').remove();

    d3.select(canvas).select('#command_at_g').selectAll('g').remove();

    d3.select(canvas).select('#rep_sen_at_g').selectAll('g').remove();

    d3.select(canvas).select('#command_idt_g').selectAll('g').remove();

    d3.select(canvas).select('#rep_sen_idt_g').selectAll('g').remove();

    d3.select(canvas).selectAll('g.fitrep').remove();

    d3.select(canvas).selectAll('g.x.axis').remove();

    d3.select(canvas).selectAll('g.y.axis').remove();
};

export const draw_psr_viz = (data) => {
    const { fitreps_g } = getPageElements();

    // Extract member's name and update H1
    const member_name = data.getName();
    if (member_name) d3.select('h1').text(`PSR - ${member_name}`);

    setFitrepHighlight(fitreps_g);

    // Tooltip for Reporting Senior and Command Bars
    make_rs_and_command_tooltip();

    // Rank Bars
    make_rank_bars(data);

    // Regular Command Bars
    make_command_bars(data);
    // Regular Reporting Senior Bars
    make_reporting_senior_bars(data);

    // IDT (SELRES) Command Bars
    make_idt_command_bars(data);
    // IDT (SELRES) Reporting Senior Bars
    make_idt_reporting_senior_bars(data);

    // AT/CC Command Bars
    make_atcc_command_bars(data);
    // AT/CC Reporting Senior Bars
    make_atcc_reporting_senior_bars(data);

    draw_fitrep_graph(data, fitreps_g);
};

function setFitrepHighlight(group) {
    fitrep_highlight = group
        .append('rect')
        .attr('width', '50px')
        .attr('height', '50px')
        .attr('fill', 'blue')
        .attr('opacity', 0.0);
}

function make_rs_and_command_tooltip() {
    // Create RS/Command tooltip
    var rs_command_bar_tooltip = d3
        .select('body')
        .append('div')
        .attr('id', 'rsCommandBarTooltip')
        .attr('class', 'tooltip rsCommandBarTooltip')
        .style('border-style', 'solid')
        .style('opacity', 0)
        .style('pointer-events', 'none');
}

function make_bars(
    dates,
    data,
    parent_g,
    bar_color = 'lightgrey',
    font_color = 'black'
) {
    // Create <g> for each value
    var g = parent_g
        .selectAll('g')
        .data(dates)
        .enter()
        .append('g')
        .attr('transform', (d) => `translate(${data.time_scale(d.start)},0)`);

    // Draw <rect> for each value
    var bars = g
        .append('rect')
        .attr('height', lib.bar_height)
        .attr('width', (d) => data.time_scale(d.end) - data.time_scale(d.start))
        .attr('fill', 'none')
        .attr('stroke', 'black')
        .attr('stroke-width', '2px')
        .attr('fill', bar_color)
        .attr('rx', '10px')
        .attr('ry', '10px')
        .on('mousemove', function (event, d) {
            update_highlight_element(event, d, fitrep_highlight, data);

            let textSoSmallNeedToShowTooltip;
            var rect_height = this.parentNode.children[0].getBBox().height;
            var rect_width = this.parentNode.children[0].getBBox().width;
            var num_chars =
                0.65 * this.parentNode.children[1].getNumberOfChars();

            var fontsize = Math.min(0.65 * rect_height, rect_width / num_chars);
            textSoSmallNeedToShowTooltip = fontsize < 10;

            if (textSoSmallNeedToShowTooltip) {
                let rsCommandBarTooltip = d3.select('#rsCommandBarTooltip');
                rsCommandBarTooltip
                    .style('left', event.pageX + 'px')
                    .style('top', event.pageY - 28 + 'px')
                    .text(`${d.value}`);
                rsCommandBarTooltip
                    .transition()
                    .duration(250)
                    .style('opacity', 1.0);
            }
        })
        .on('mouseleave', function (event, d) {
            clear_fitrep_highlight(fitrep_highlight);

            let rsCommandBarTooltip = d3.select('#rsCommandBarTooltip');
            rsCommandBarTooltip
                .transition()
                .duration(250)
                .style('opacity', 0.0);
        });

    // Create <text> for each value
    g.append('text')
        .attr(
            'transform',
            (d) =>
                `translate(${
                    0.5 * (data.time_scale(d.end) - data.time_scale(d.start))
                },${0.5 * lib.bar_height})`
        )
        .style('text-anchor', 'middle')
        .style('pointer-events', 'none')
        .style('fill', font_color)
        .text((d) => d.value)
        .style('font-size', function (d) {
            var rect_height = this.parentNode.children[0].getBBox().height;
            var rect_width = this.parentNode.children[0].getBBox().width;
            var num_chars = 0.65 * this.getNumberOfChars();

            var return_val_in_px = Math.min(
                0.65 * rect_height,
                rect_width / num_chars
            );
            return `${return_val_in_px}px`;
        });
}

function make_rank_bars(data) {
    const { rank_g } = getPageElements();

    var dates_of_rank = data.get_paygrade_dates();
    make_bars(dates_of_rank, data, rank_g, lib.rank_bar_color);
}

function make_command_bars(data) {
    const { command_rg_g } = getPageElements();

    var command_dates = data.get_station_dates({
        regex: new RegExp('^RG$', 'g'),
        filterColumn: 'rpt_type',
    });

    make_bars(
        command_dates,
        data,
        command_rg_g,
        lib.regular_command_bar_color,
        'white'
    );
}

function make_reporting_senior_bars(data) {
    const { rep_sen_rg_g } = getPageElements();
    var reporting_senior_dates = data.get_rs_name_dates({
        regex: new RegExp('^RG$', 'g'),
    });

    make_bars(
        reporting_senior_dates,
        data,
        rep_sen_rg_g,
        lib.regular_command_bar_color,
        'white'
    );
}

function make_idt_command_bars(data) {
    const { command_idt_g } = getPageElements();

    var command_dates = data.get_station_dates({
        regex: new RegExp('^IDT', 'g'),
        filterColumn: 'rpt_type',
    });

    make_bars(
        command_dates,
        data,
        command_idt_g,
        lib.idt_command_bar_color,
        'white'
    );
}

function make_idt_reporting_senior_bars(data) {
    const { rep_sen_idt_g } = getPageElements();
    var reporting_senior_dates = data.get_rs_name_dates({
        regex: new RegExp('^IDT', 'g'),
    });

    make_bars(
        reporting_senior_dates,
        data,
        rep_sen_idt_g,
        lib.idt_command_bar_color,
        'white'
    );
}

function make_atcc_command_bars(data) {
    const { command_at_g } = getPageElements();
    var non_regular_command_dates = data.get_station_dates({
        regex: new RegExp('(AT|CC)', 'g'),
        filterColumn: 'rpt_type',
    });

    make_bars(
        non_regular_command_dates,
        data,
        command_at_g,
        lib.at_cc_command_bar_color
    );
}

function make_atcc_reporting_senior_bars(data) {
    const { rep_sen_at_g } = getPageElements();
    var concurrent_command_reporting_senior_dates = data.get_rs_name_dates({
        regex: new RegExp('(AT|CC)', 'g'),
    });

    make_bars(
        concurrent_command_reporting_senior_dates,
        data,
        rep_sen_at_g,
        lib.at_cc_command_bar_color
    );
}

function draw_axes(group, data) {
    // Draw time axis
    group
        .append('g')
        .attr('class', 'x axis')
        .attr(
            'transform',
            `translate(0, ${lib.fitrep_height - lib.rsca_scale(0)})`
        )
        .call(d3.axisBottom(data.time_scale));

    // Draw 'Trait Avg - RSCA' axis
    group
        .append('g')
        .attr('class', 'y axis')
        .attr(
            'transform',
            `translate(${data.time_scale(data.min_start_date)}, 0)`
        )
        .call(d3.axisLeft(lib.rsca_scale));
}

function draw_fitrep_graph(data, group) {
    // FITREPs
    // #region Draw FITREPs plot

    // Create fitrepTooltip
    var fitrepTooltip = d3
        .select('body')
        .append('div')
        .attr('class', 'tooltip fitrepTooltip')
        .style('border-style', 'solid')
        .style('opacity', 0)
        .style('pointer-events', 'none');

    // Create FITREP gap tooltip
    var fitrepGapTooltip = d3
        .select('body')
        .append('div')
        .attr('class', 'tooltip fitrepGapTooltip')
        .style('border-style', 'solid')
        .style('opacity', 0)
        .style('pointer-events', 'none');

    draw_axes(group, data);

    group.on('mouseenter', function () {
        clear_fitrep_highlight(fitrep_highlight);
    });

    // Append FITREP marker groups
    const fitrep_marker_gs = group
        .selectAll('g.fitrep')
        .data(data.psr)
        .enter()
        .append('g')
        .attr('class', 'fitrep dot')
        .attr('transform', function (d) {
            return `translate(${data.time_scale(
                d.end_date
            )}, ${d.rsca ? lib.rsca_scale(d.trait_avg - d.rsca) : lib.rsca_scale(0)})`;
        });

    // Draw FITREP markers
    fitrep_marker_gs
        .append('path')
        .attr('d', function (d) {
            var symbol = lib.fitrep_shape_scale(d.prom_rec.toUpperCase());
            var size = lib.fitrep_marker_size(
                d.n_sp + d.n_pr + d.n_p + d.n_mp + d.n_ep
            );
            return symbol.size(size)();
        })
        .attr('fill', (d) => lib.fitrep_color_scale(d.prom_rec.toUpperCase()))
        .attr('opacity', lib.fitrep_marker_opacity)
        .on('mouseover', function (event, d) {
            fitrepTooltip
                .transition()
                .duration(250)
                .style('opacity', lib.fitrep_tooltip_opacity);
            fitrepTooltip
                .html(fitrepTooltipHTML(d))
                .style('left', event.pageX + 'px')
                .style('top', event.pageY - 28 + 'px');
        })
        .on('mouseout', function (d) {
            fitrepTooltip.transition().duration(250).style('opacity', 0);
        });
    // Draw FITREP marker outlines
    fitrep_marker_gs
        .append('path')
        .attr('d', function (d) {
            var symbol = lib.fitrep_shape_scale(d.prom_rec.toUpperCase());
            var size = lib.fitrep_marker_size(
                d.n_sp + d.n_pr + d.n_p + d.n_mp + d.n_ep
            );
            return symbol.size(size)();
        })
        .attr('fill', 'none')
        .attr('stroke', function (d) {
            if (d.prom_rec.toUpperCase() != 'NOB' && d.rsca == 0) {
                return 'red';
            } else {
                return 'black';
            }
        })
        .attr('stroke-width', lib.fitrep_marker_stroke_width)
        .attr('opacity', 1)
        .on('mouseover', function (event, d) {
            fitrepTooltip
                .transition()
                .duration(250)
                .style('opacity', lib.fitrep_tooltip_opacity);
            fitrepTooltip
                .html(fitrepTooltipHTML(d))
                .style('left', event.pageX + 'px')
                .style('top', event.pageY - 28 + 'px');
        })
        .on('mouseout', function (d) {
            fitrepTooltip.transition().duration(250).style('opacity', 0);
        });

    // Draw comparable FITREP lines
    const line = d3
        .line()
        .x((d) => data.time_scale(d.end_date))
        .y((d) => lib.rsca_scale(d.rsca ? d.trait_avg - d.rsca : 0));

    group
        .selectAll('lines')
        .data(data.fitrepsGroupedByPaygradeAndRepsen())
        .enter()
        .append('g')
        .attr('class', 'fitrep line')
        .append('path')
        .attr('d', (d) => line(d))
        .attr('fill', 'none')
        .attr('stroke', '#000')
        .attr('stroke-width', '2.5px')
        .attr('opacity', 0.5)
        .attr('pointer-events', 'none');

    // Draw dotted line for same Reporting Senior, different Rank
    group
        .selectAll('lines')
        .data(data.fitrepsSameRsNewRank())
        .enter()
        .append('g')
        .attr('class', 'fitrep line')
        .append('path')
        .attr('d', (d) => line(d))
        .attr('fill', 'none')
        .attr('stroke', '#000')
        .attr('stroke-width', '2.5px')
        .attr('opacity', 0.5)
        .attr('stroke-dasharray', '5,3')
        .attr('pointer-events', 'none');

    // FITREP Gaps
    group
        .append('g')
        .attr('class', 'fitrep gap')
        .selectAll('rect')
        .data(data.fitrepGaps())
        .enter()
        .append('rect')
        .attr('transform', (d) => `translate(${data.time_scale(d[0])},0)`)
        .attr('height', lib.rsca_scale.range()[0])
        .attr(
            'width',
            (d) => `${data.time_scale(d[1]) - data.time_scale(d[0])}px`
        )
        .attr('fill', lib.gap_color)
        .attr('opacity', lib.gap_opacity)
        .on('mouseover', function (event, d) {
            let gapRectBoundingRect = event.target.getBoundingClientRect();
            fitrepGapTooltip
                .transition()
                .duration(250)
                .style('opacity', lib.fitrep_gap_tooltip_opacity);
            fitrepGapTooltip
                .html(fitrepGapTooltipHTML(d))
                .style('left', gapRectBoundingRect.right + window.scrollX)
                .style('top', gapRectBoundingRect.top + window.scrollY);
        })
        .on('mouseout', function (d) {
            fitrepGapTooltip.transition().duration(250).style('opacity', 0.0);
        });
    // #endregion
}

function update_highlight_element(e, d, element, data) {
    element
        .attr('transform', `translate(${data.time_scale(d.start)}, 0)`)
        .attr('width', `${data.time_scale(d.end) - data.time_scale(d.start)}`)
        .attr(
            'height',
            `${lib.rsca_scale.range()[0] - lib.rsca_scale.range()[1]}`
        )
        .transition()
        .duration(250)
        .style('opacity', 0.2);
}

function clear_fitrep_highlight(element_to_clear) {
    element_to_clear.style('opacity', 0);
}

function fitrepTooltipHTML(d) {
    var delta = d.trait_avg ? (d.trait_avg - d.rsca).toFixed(2) : 'n/a';
    delta = delta == '-0.00' ? '0.00' : delta;
    delta = delta > 0 ? '+' + delta : delta;
    delta = d.rsca ? delta : 'n/a';

    var begin = lib.dateFormatter_mmddyy(d.start_date);
    var end = lib.dateFormatter_mmddyy(d.end_date);

    return `
    <strong>Period:</strong> ${begin} to ${end}<br>
    <strong>Report Type:</strong> ${d.rpt_type}<br>
    <br>
    <strong>Reporting Senior:</strong> ${d.rs_name}<br>
    <strong>Reporting Senior Title:</strong> ${d.rs_title}<br>
    <strong>Command:</strong> ${d.station}<br>
    <br>
    <strong>Paygrade:</strong> ${d.paygrade}<br>
    <strong>Trait Average:</strong> ${
        d.trait_avg ? d.trait_avg.toFixed(2) : 'n/a'
    }<br>
    <strong>RSCA:</strong> ${d.rsca ? d.rsca : 'n/a'}<br>
    <strong>Delta:</strong> ${delta} <br>
    <br>
    <table>
        <tr>
            <td>${
                d.prom_rec.toUpperCase() == 'SP' ? '<strong>SP</strong>' : 'SP'
            }</td>
            <td>${
                d.prom_rec.toUpperCase() == 'PR' ? '<strong>PR</strong>' : 'PR'
            }</td>
            <td>${
                d.prom_rec.toUpperCase() == 'P' ? '<strong>P</strong>' : 'P'
            }</td>
            <td>${
                d.prom_rec.toUpperCase() == 'MP' ? '<strong>MP</strong>' : 'MP'
            }</td>
            <td>${
                d.prom_rec.toUpperCase() == 'EP' ? '<strong>EP</strong>' : 'EP'
            }</td>
            </tr>
        <tr>
            <td>${
                d.prom_rec.toUpperCase() == 'SP'
                    ? `<strong>${d.n_sp}</strong>`
                    : `${d.n_sp}`
            }</td>
            <td>${
                d.prom_rec.toUpperCase() == 'PR'
                    ? `<strong>${d.n_pr}</strong>`
                    : `${d.n_pr}`
            }</td>
            <td>${
                d.prom_rec.toUpperCase() == 'P'
                    ? `<strong>${d.n_p}</strong>`
                    : `${d.n_p}`
            }</td>
            <td>${
                d.prom_rec.toUpperCase() == 'MP'
                    ? `<strong>${d.n_mp}</strong>`
                    : `${d.n_mp}`
            }</td>
            <td>${
                d.prom_rec.toUpperCase() == 'EP'
                    ? `<strong>${d.n_ep}</strong>`
                    : `${d.n_ep}`
            }</td>
        </tr>
    </table>
    `;
}

function fitrepGapTooltipHTML(d) {
    var begin = lib.dateFormatter_mmddyy(d[0]);
    var end = lib.dateFormatter_mmddyy(d[1]);

    return `<strong>Continuity Gap:</strong><br>${begin} to ${end}`;
}

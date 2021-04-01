'use strict';

import * as lib from './lib/lib.js';

document.addEventListener('DOMContentLoaded', function() {

    // Horizontal (time) scale
    const time_scale = d3.scaleTime()
                    .domain([Date.now() - 15*365*24*60*60*1000, Date.now()])
                    .range([0, (lib.canvas_width-lib.labels_width-lib.margin.left-lib.margin.right)]);

    // Vertical (RSCA) scale
    const rsca_scale = d3.scaleLinear()
                    .domain([-1,1])
                    .range([lib.fitrep_height, 0]);

    // SVG canvas and main container groups
    const svg = d3.select('body')
                        .append('svg')
                        .attr('id', 'canvas')
                        .attr('width', lib.canvas_width)
                        .attr('height', lib.canvas_height);
                        
                        
    const container_g = d3.select('#canvas')
                            .append('g')
                            .attr('id', 'container_g')
                            .attr('transform', `translate(${lib.margin.left}, ${lib.margin.top})`);
    
    
    const rank_g = container_g.append('g')
                                .attr('id', 'rank_g')
                                .attr('transform', `translate(${lib.labels_width}, 0)`);

    const command_g = container_g.append('g')
                                    .attr('id', 'command_g')
                                    .attr('transform', `translate(${lib.labels_width}, ${lib.bar_height + lib.margin.gap})`);

    const rep_sen_g = container_g.append('g')
                                    .attr('id', 'rep_sen_g ')
                                    .attr('transform', `translate(${lib.labels_width}, ${2*lib.bar_height + 2*lib.margin.gap})`);

    const command_cc_g = container_g.append('g')
                                    .attr('id', 'command_cc_g')
                                    .attr('transform', `translate(${lib.labels_width}, ${3*lib.bar_height + 3*lib.margin.gap})`);

    const rep_sen_cc_g = container_g.append('g')
                                    .attr('id', 'rep_sen_cc_g ')
                                    .attr('transform', `translate(${lib.labels_width}, ${4*lib.bar_height + 4*lib.margin.gap})`);

    const fitreps_g = container_g
                        .append('g')
                        .attr('id', 'fitreps_g')
                        .attr('transform', `translate(${lib.labels_width}, ${5*lib.bar_height + 5*lib.margin.gap})`);


    // d3.selectAll('#rank, #command, #rep_sen')
    //     .append('defs')
    //     .append('filter')
    //     .attr('id', 'f2')
    //     .attr('width', '150%')
    //     .attr('height', '150%')
    //     .append('feDropShadow');

    const draw_fitreps = data => {

        // Extract member's name and update H1
        const member_name = data[0].name;
        if (member_name) d3.select('h1').text(`PSR - ${member_name}`);

        // Rank Bar
        /// Get dates of rank
        var dates_of_rank = lib.get_dates_of_rank(data);
        console.log(dates_of_rank);

        /// Create <g> for each rank
        var rank_bar_groups = rank_g.selectAll('g')
                    .data(dates_of_rank)
                    .enter()
                    .append('g')
                    .attr('transform', d => `translate(${time_scale(d.start)},0)`);

        /// Draw <rect> for each rank
        rank_bar_groups.append('rect')
                    .attr('height', 0.8*lib.bar_height)
                    .attr('width', d => time_scale(d.end)-time_scale(d.start))
                    .attr('fill', 'none')
                    .attr('stroke', 'black')
                    .attr('stroke-width', '2px')
                    .attr('fill', 'lightgrey')
                    .attr('rx', '10px')
                    .attr('ry', '10px');

        /// Create <text> for each rank
        rank_bar_groups.append('text')
                        .attr('transform', d => `translate(${0.5*(time_scale(d.end)-time_scale(d.start))},${0.5*lib.bar_height})`)
                        .style('text-anchor', 'middle')
                        .text(d => d.rank);

        // Regular Commands bar
        {
            var command_dates = lib.get_command_dates(data, new RegExp('^(?!.*(AT|CC)).*$', 'g'));
            // var command_dates = lib.get_command_dates(data, new RegExp('![AT|CC]', 'g'));
            // var command_dates = lib.get_command_dates(data, new RegExp('.', 'g'));



        // console.log(command_dates);

        var command_bar_groups = command_g.selectAll('g')
                    .data(command_dates)
                    .enter()
                    .append('g')
                    .attr('transform', d => `translate(${time_scale(d.start)},0)`);

        command_bar_groups.append('rect')
                    .attr('height', 0.8*lib.bar_height)
                    .attr('width', d => time_scale(d.end)-time_scale(d.start))
                    .attr('fill', 'none')
                    .attr('stroke', 'black')
                    .attr('stroke-width', '2px')
                    .attr('fill', 'lightblue')
                    .attr('rx', '10px')
                    .attr('ry', '10px');

        command_bar_groups.append('text')
                        .attr('transform', d => `translate(${0.5*(time_scale(d.end)-time_scale(d.start))},${0.5*lib.bar_height})`)
                        .style('text-anchor', 'middle')
                        .text(d => d.command);
        }

        // Concurrent Command bar
        {
            var non_regular_command_dates = lib.get_command_dates(data, new RegExp('(AT|CC)', 'g'));
            // var command_dates = lib.get_command_dates(data, new RegExp('![AT|CC]', 'g'));
            // var command_dates = lib.get_command_dates(data, new RegExp('.', 'g'));



        // console.log(non_regular_command_dates);

        var command_cc_bar_groups = command_cc_g.selectAll('g')
                    .data(non_regular_command_dates)
                    .enter()
                    .append('g')
                    .attr('transform', d => `translate(${time_scale(d.start)},0)`);

        command_cc_bar_groups.append('rect')
                    .attr('height', 0.8*lib.bar_height)
                    .attr('width', d => time_scale(d.end)-time_scale(d.start))
                    .attr('fill', 'none')
                    .attr('stroke', 'black')
                    .attr('stroke-width', '2px')
                    .attr('fill', 'lightblue')
                    .attr('rx', '10px')
                    .attr('ry', '10px');

        command_cc_bar_groups.append('text')
                        .attr('transform', d => `translate(${0.5*(time_scale(d.end)-time_scale(d.start))},${0.5*lib.bar_height})`)
                        .style('text-anchor', 'middle')
                        .text(d => d.command);
        }




       // FITREPs
        {
        // Create tooltip
        var tooltip = d3.select("body").append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0);
        // Draw time axis
        fitreps_g.append('g')
                    .attr('class', 'x axis')
                    .attr('transform', `translate(0, ${lib.fitrep_height-rsca_scale(0)})`)
                    .call(d3.axisBottom(time_scale));

        // Draw "Trait Avg - RSCA" axis
        fitreps_g.append('g')
                    .attr('class', 'y axis')
                    .call(d3.axisLeft(rsca_scale));

        // Draw FITREPs
        fitreps_g.selectAll('g.fitrep')
                        .data(data)
                        .enter()
                        .append('g')
                        .attr('transform', function(d) {
                            return `translate(${time_scale(d.end_date)}, ${rsca_scale(d.trait_avg-d.rsca)})`
                        })
                        .append('text')
                        // .attr("dy", "o.5em")
                        .text(d => {
                            var val = d.prom_rec.toLowerCase();
                            val = val==="nob" ? "n" : val;
                            return (val.toUpperCase());
                        })
                        .on("mouseover", function(event,d) {
                            tooltip.transition()
                              .duration(200)
                              .style("opacity", .9);
                            // tooltip.html(formatTime(d.end_date) + "<br/>" + formatTime(d.end_date))
                            tooltip.html(d.end_date)
                              .style("left", (event.pageX) + "px")
                              .style("top", (event.pageY - 28) + "px");
                            })
                          .on("mouseout", function(d) {
                            tooltip.transition()
                              .duration(500)
                              .style("opacity", 0);
                            });

        var comparable_fitreps = lib.fitreps_grouped_by_paygrade_and_repsen(data);
        console.log(comparable_fitreps);

        const line = d3.line()
                        .x(d => time_scale(d.end_date))
                        .y(d => rsca_scale(d.trait_avg-d.rsca));
        fitreps_g.selectAll('lines')
                        .data(comparable_fitreps)
                        .enter()
                        .append('g')
                        .append('path')
                        .attr('d', d => line(d))
                        .attr('fill', 'none')
                        .attr('stroke', '#000')
                        .attr('stroke-width', '3px');


    }
}

    const data = d3.csv('./data/gardner.csv', d3.autoType)
                .then(data => {
                    console.log(data);
                    return(data);
                })
                .then(data => draw_fitreps(data));


})


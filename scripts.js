'use strict';

import * as lib from './lib/lib.js';

document.addEventListener('DOMContentLoaded', function() {

    // Horizontal (time) scale
    const time_scale = d3.scaleTime()
                    .domain([Date.now() - 15*365*24*60*60*1000, Date.now()])
                    .range([0, lib.fitrep_width]);

    // Vertical (RSCA) scale
    const rsca_scale = d3.scaleLinear()
                    .domain([-1,1])
                    .range([lib.fitrep_height, 0]);

    // FITREP canvas
    const fitrep_canvas = d3.select('#fitreps')
                        .append('svg')
                        .attr('width', lib.fitrep_width + lib.margin.left + lib.margin.right)
                        .attr('height', lib.fitrep_height + lib.margin.bottom + lib.margin.top)
                        .append('g')
                        .attr('id', 'fitrep_canvas')
                        .attr('transform', `translate(${lib.margin.left}, ${lib.margin.top})`);

    // Rank bar canvas
    const rank_canvas = d3.select('#rank')
                            .append('svg')
                            .attr('width', lib.bar_width)
                            .attr('height', lib.bar_height)
                            .append('g')
                            .attr('id', 'rank_canvas')
                            .attr('transform', `translate(${2*lib.margin.left}, 0)`);
                            // .attr('transform', `translate(0,0)`);

    // Command bar canvas
    const command_canvas = d3.select('#command')
                            .append('svg')
                            .attr('width', lib.bar_width)
                            .attr('height', lib.bar_height)
                            .append('g')
                            .attr('id', 'command_canvas')
                            .attr('transform', `translate(${lib.margin.left}, ${lib.margin.top})`);

    // Reporting Senior bar canvas
    const rep_sen_canvas = d3.select('#rep_sen')
                            .append('svg')
                            .attr('width', lib.bar_width)
                            .attr('height', lib.bar_height)
                            .append('g')
                            .attr('id', 'rep_sen_canvas')
                            .attr('transform', `translate(${lib.margin.left}, ${lib.margin.top})`);
    
    const draw_fitreps = data => {

        // Extract member's name and update H1
        const member_name = data[0].name;
        if (member_name) d3.select('h1').text(`PSR - ${member_name}`);

        // Rank Bar
        var dates_of_rank = lib.get_dates_of_rank(data);
        console.log(dates_of_rank);

        var rank_bar_groups = rank_canvas.selectAll('g')
                    .data(dates_of_rank)
                    .enter()
                    .append('g')
                    .attr('transform', d => `translate(${time_scale(d.start)},0)`);

        rank_bar_groups.append('rect')
                    .attr('height', 0.8*lib.bar_height)
                    .attr('width', d => time_scale(d.end)-time_scale(d.start))
                    .attr('fill', 'none')
                    .attr('stroke', 'black')
                    .attr('stroke-width', '2px')
                    .attr('fill', 'lightgrey')
                    .attr('rx', '10px')
                    .attr('ry', '10px');

        rank_bar_groups.append('text')
                        .attr('transform', d => `translate(${0.5*(time_scale(d.end)-time_scale(d.start))},${0.5*lib.bar_height})`)
                        .style('text-anchor', 'middle')
                        .text(d => d.rank);

       
        // Draw time axis
        fitrep_canvas.append('g')
                    .attr('class', 'x axis')
                    .attr('transform', `translate(0, ${lib.fitrep_height-rsca_scale(0)})`)
                    .call(d3.axisBottom(time_scale));

        // Draw "Trait Avg - RSCA" axis
        fitrep_canvas.append('g')
                    .attr('class', 'y axis')
                    .call(d3.axisLeft(rsca_scale));

        // Draw FITREPs
        fitrep_canvas.selectAll('g.fitrep')
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
                        });
    }




    const data = d3.csv('./data/gardner.csv', d3.autoType)
                .then(data => {
                    console.log(data);
                    return(data);
                })
                .then(data => draw_fitreps(data));


})


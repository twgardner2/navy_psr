'use strict';

import * as lib from './lib/lib.js';

console.log(lib.test_var);
document.addEventListener('DOMContentLoaded', function() {

    // Create scales
    const time_scale = d3.scaleTime()
                    .domain([Date.now() - 10*365*24*60*60*1000, Date.now()])
                    .range([0, lib.fitrep_width]);


    const rsca_scale = d3.scaleLinear()
                    .domain([-1,1])
                    .range([0, lib.fitrep_height]);


    const fitrep_canvas = d3.select('#fitreps')
                        .append('svg')
                        .attr('width', lib.fitrep_width + lib.margin.left + lib.margin.right)
                        .attr('height', lib.fitrep_height + lib.margin.bottom + lib.margin.top);

    
    const draw_fitreps = data => {

        const member_name = data[0].name;
        d3.select('h1')
            .text(`PSR - ${member_name}`);
        
        // Draw time axis
        fitrep_canvas.append('g')
                    .attr('class', 'x axis')
                    .attr('transform', 'translate(0,' + (lib.fitrep_height-rsca_scale(0)) + ')')
                    .call(d3.axisBottom(time_scale)); // Create an axis component with d3.axisBottom

        // Draw "Trait Avg - RSCA" axis

        fitrep_canvas.selectAll('g').data(data)
                        .enter()
                        .append('g')
                        .attr('transform', function(d) {
                            return 'translate(' + time_scale(d.end_date) + ', ' + (lib.fitrep_height-rsca_scale(d.trait_avg-d.rsca)) + ')'
                        })
                        .append('text')
                        .text(d => {
                            var val = d.prom_rec.toLowerCase();
                            // console.log(val.toUpperCase());
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


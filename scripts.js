'use strict';

import * as lib from './lib/lib.js';

document.addEventListener('DOMContentLoaded', function() {

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

    // Append form
    const form_div = d3.select('body')
                        .append('div')
                        .attr('id', 'form_div');

    // d3.selectAll('#rank, #command, #rep_sen')
    //     .append('defs')
    //     .append('filter')
    //     .attr('id', 'f2')
    //     .attr('width', '150%')
    //     .attr('height', '150%')
    //     .append('feDropShadow');

    const draw_psr_viz = data => {

        var fitrep_gaps = lib.fitrep_gaps(data);
        console.log('fitrep_gaps');
        console.log(fitrep_gaps);

        // Extract member's name and update H1
        const member_name = data[0].name;
        if (member_name) d3.select('h1').text(`PSR - ${member_name}`);

        const start_dates = data.map(d=>d.start_date);
        const end_dates = data.map(d=>d.end_date);

        var min_start_date = new Date(Math.min(...start_dates));
        var max_end_date = new Date(Math.max(...end_dates));

        // Horizontal (time) scale
        const time_scale = d3.scaleTime()
            // .domain([Date.now() - 15*365*24*60*60*1000, Date.now()])
            .domain([min_start_date, max_end_date])
            .range([0, (lib.canvas_width-lib.labels_width-lib.margin.left-lib.margin.right)]);

        // Vertical (RSCA) scale
        const rsca_scale = d3.scaleLinear()
            .domain([-1,1])
            .range([lib.fitrep_height, 0]);

        // Rank Bar
        {
        /// Get dates of rank
        var dates_of_rank = lib.get_dates_of_rank(data);

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
                        .text(d => d.rank)
                        .style('font-size', function(d) {
                            // var box = this.parentNode;
                            var rect_height = this.parentNode.children[0].getBBox().height;
                            var rect_width = this.parentNode.children[0].getBBox().width;
                            var num_chars = 0.65 * this.getNumberOfChars();

                            var return_val_in_px = Math.min(
                                0.65 * rect_height,
                                rect_width/num_chars
                            );

                            // return '10px';
                            return (`${return_val_in_px}px`);
                            
                        });
        }

        // Regular Commands bar
        {
        var command_dates = lib.get_command_dates(data, new RegExp('^(?!.*(AT|CC)).*$', 'g'));
        // var command_dates = lib.get_command_dates(data, new RegExp('![AT|CC]', 'g'));
        // var command_dates = lib.get_command_dates(data, new RegExp('.', 'g'));


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
                        .text(d => d.command)
                        .style('font-size', function(d) {
                            // var box = this.parentNode;
                            var rect_height = this.parentNode.children[0].getBBox().height;
                            var rect_width = this.parentNode.children[0].getBBox().width;
                            var num_chars = 0.65 * this.getNumberOfChars();

                            // console.log(rect_width);
                            // console.log(num_chars);
                            // console.log(rect_width/num_chars);
                            // console.log('---------------');


                            var return_val_in_px = Math.min(
                                0.65 * rect_height,
                                rect_width/num_chars
                            );

                            // return '10px';
                            return (`${return_val_in_px}px`);
                            
                        });
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
                        .text(d => d.command)
                        .style('font-size', function(d) {
                            // var box = this.parentNode;
                            var rect_height = this.parentNode.children[0].getBBox().height;
                            var rect_width = this.parentNode.children[0].getBBox().width;
                            var num_chars = 0.65 * this.getNumberOfChars();

                            console.log(rect_width);
                            console.log(num_chars);
                            console.log(rect_width/num_chars);

                            var return_val_in_px = Math.min(
                                0.65 * rect_height,
                                rect_width/num_chars
                            );

                            // return '10px';
                            return (`${return_val_in_px}px`);
                            
                        });
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
                    .attr('transform', `translate(${time_scale(min_start_date)}, 0)`)
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
                        .style('text-anchor', 'middle')
                        // .attr("dy", "o.5em")
                        .text(d => {
                            var val = d.prom_rec.toLowerCase();
                            val = val==="nob" ? "n" : val;
                            return (val.toUpperCase());
                        })
                        .on("mouseover", function(event,d) {
                            tooltip.transition()
                              .duration(400)
                              .style("opacity", .9);

                            tooltip.html(lib.fitrep_tooltip(d))
                              .style("left", (event.pageX) + "px")
                              .style("top", (event.pageY - 28) + "px");
                            })
                          .on("mouseout", function(d) {
                            tooltip.transition()
                              .duration(400)
                              .style("opacity", 0);
                            });

        var comparable_fitreps = lib.fitreps_grouped_by_paygrade_and_repsen(data);
        // console.log(comparable_fitreps);

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
                        .attr('stroke-width', '2.5px')
                        .attr('opacity', 0.5);


        }

        // FITREP Gaps
        {
        // fitreps_g.selectAll('rect')
        //     .data(fitrep_gaps)
        //     // .append('g')
        //     .append('rect')
        
        fitreps_g.append('g')
            .selectAll('rect')
            .data(fitrep_gaps)
            .enter()
            // // .append('g')
            .append('rect')
            .attr('transform', d => `translate(${time_scale(d[0])},0)`)
            .attr('height', rsca_scale.range()[0])
            .attr('width', d => `${time_scale(d[1])-time_scale(d[0])}px`)
            // .attr('width', '50px')
            .attr('fill', 'red')
            .attr('opacity', 0.2);
        // .attr('transform', d => `translate(${time_scale(d[0])},0)`)
            // .attr('height', d => '500px')
            // .attr('width', d => lib.time_scale(d[1]-d[0]))
            // .attr('fill', 'blue')
        }

}


    const populate_form = data => {
        console.log('populate form');

        var schema = {
            fields: [
                {name: 'name', type: 'text', display: 'Name'},
                {name: 'paygrade', type: 'text', display: 'Paygrade'},
                {name: 'station', type: 'text', display: 'Station'},
                {name: 'duty', type: 'text', display: 'Duty'},
                {name: 'start_date', type: 'date', display: 'Start Date'},
                {name: 'end_date', type: 'date', display: 'End Date'},
                {name: 'months', type: 'number', display: 'Months'},
                {name: 'rs_name', type: 'text', display: 'Reporting Senior Name'},
                {name: 'rs_paygrade', type: 'text', display: 'Reporting Senior Paygrade'},
                {name: 'rs_title', type: 'text', display: 'Reporting Title'},
                {name: 'trait_avg', type: 'number', display: 'Trait Avg'},
                {name: 'rsca', type: 'number', display: 'Reporting Senior Cumulative Avg'},
                {name: 'prom_rec', type: 'text', display: 'Reporting Title'},
                {name: 'n_sp', type: 'number', display: '# SP'},
                {name: 'n_pr', type: 'number', display: '# PR'},
                {name: 'n_p', type: 'number', display: '# P'},
                {name: 'n_mp', type: 'number', display: '# MP'},
                {name: 'n_ep', type: 'number', display: '# EP'},
                {name: 'prt', type: 'text', display: 'PRT'},
                {name: 'rpt_type', type: 'text', display: 'Report Type'},
            ]
        };

        // Add form header row
        var header = form_div.append('div')
                                .attr('class', 'form_row header')
                                .style('display', 'flex')
                                .selectAll('div')                                
                                .data(schema.fields)
                                .enter()
                                .append('div')
                                .attr('class', 'header_items')
                                .text(d => d.display)
                                .style('margin', '10px')


        // Add form rows for each FITREP
        //// http://jsfiddle.net/ZRQPP/
        var form_rows = form_div.selectAll('div.form_row')
                    .data(data)
                    .enter()
                    .append('div')
                    .attr('class', 'form_row')
                    .style('display', 'flex')



                    .selectAll('div')
                    .data(  d => Object.entries(d)  )
                    .enter()
                    .append('div')
                    .classed('form_field', true)
                    // .text(d => d[1])
                    .text(d => {
                        var schema_entry = schema.fields.filter(el => el.name == d[0]);
                        console.log(schema_entry);

                        var type = schema_entry[0] ? schema_entry[0].type : null;
                        console.log(type);


                        // console.log(d[0]);
                        return d[1];
                    })
                    // .attr('class', 'form_field')
                    // .text(d=> d.start_date)




                    // .each(d => {
                    //     // const self = d3.select(this);
                    //     // for (const property in d) {
                    //     //     console.log(`${property}: ${d[property]}`);
                    //     //   }
                    //     console.log(Object.entries(d));
                    // })


                //     .each(function(d){
                //         var self = d3.select(this);
                //         console.log(this);
                //         var label = self.append("label")
                //             .text(d.display)
                //             .style("width", "100px")
                //             .style("display", "inline-block");
        
                //         if(d.type == 'text'){
                //             var input = self.append("input")
                //                 .attr({
                //                     type: function(d){ return d.type; },
                //                     name: function(d){ return d.name; }
                //                 });
                //         }
        
                //         if(d.type == 'dropdown'){
                //         var select = self.append("select")
                //                 .attr("name", "country")
                //                 .selectAll("option")
                //                 .data(d.values)
                //                 .enter()
                //                 .append("option")
                //                 .text(function(d) { return d; });
                //         }
        
                //     });
        
                // form_div.append("button").attr('type', 'submit').text('Save');
    }

    const data = d3.csv('./data/gardner.csv', d3.autoType)
                .then(data => {
                    console.log(data);
                    return(data);
                })
                .then(data => {
                    populate_form(data);
                    return(data);
                })
                .then(data => draw_psr_viz(data));


})


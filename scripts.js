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
                                    .attr('transform', `translate(${lib.labels_width}, ${2*lib.bar_height + lib.margin.gap})`);

    const command_cc_g = container_g.append('g')
                                    .attr('id', 'command_cc_g')
                                    .attr('transform', `translate(${lib.labels_width}, ${3*lib.bar_height + 3*lib.margin.gap})`);

    const rep_sen_cc_g = container_g.append('g')
                                    .attr('id', 'rep_sen_cc_g ')
                                    .attr('transform', `translate(${lib.labels_width}, ${4*lib.bar_height + 3*lib.margin.gap})`);

    const fitreps_g = container_g
                        .append('g')
                        .attr('id', 'fitreps_g')
                        .attr('transform', `translate(${lib.labels_width}, ${5*lib.bar_height + 5*lib.margin.gap})`);


    // Append rerender button
    const rerender_button = d3.select('body')
                              .append('div')
                              .append('button')
                              .text('Re-Render')
                              .on('click', function(event) {
                                var table_data = lib.parse_data_from_table();
                                console.log(table_data);
                                console.log('clearing psr...')
                                clear_psr_viz(document.getElementById('canvas'));
                                console.log('drawing again');
                                draw_psr_viz(table_data);
                              });
    // Append FITREP table
    const table = d3.select('body')
                    .append('table')
                    .attr('id', 'fitrep_table');

    // d3.selectAll('#rank, #command, #rep_sen')
    //     .append('defs')
    //     .append('filter')
    //     .attr('id', 'f2')
    //     .attr('width', '150%')
    //     .attr('height', '150%')
    //     .append('feDropShadow');

    const draw_psr_viz = data => {
        // console.log('redrawing...');
        // console.log(data);

        var fitrep_gaps = lib.fitrep_gaps(data);
        // console.log('fitrep_gaps');
        // console.log(fitrep_gaps);

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

        // FITREP Promotion Recommendation Text Size Scale
        const text_size_scale = d3.scaleLinear()
            .domain([1,10])
            .range([9,16])
            .clamp(true);

        
        // FITREP Highlight Interaction
        function update_highlight_element(e, d, element) {

            element
                .attr('transform', `translate(${time_scale(d.start)}, 0)`)
                .attr('width', `${time_scale(d.end)-time_scale(d.start)}`)
                // .attr('transform', `translate(${time_scale(lib.add_days_to_date(d.start, 100))}, 0)`)
                // .attr('width', `${time_scale(d.end)-time_scale(lib.add_days_to_date(d.start, 100))}`)
                .attr('height', `${rsca_scale.range()[0] - rsca_scale.range()[1]}`)
                .transition()
                .duration(200)
                .style('opacity', 0.2);
        
        }
        function clear_fitrep_highlight(element_to_clear) {
            element_to_clear.style('opacity', 0);
        }

        // Command and Reporting Senior Bar Hover Rect
        {
            var fitrep_highlight = fitreps_g
                                        .append('rect')
                                        .attr('width', '50px')
                                        .attr('height', '50px')
                                        .attr('fill', 'blue')
                                        .attr('opacity', 0.0);
        }

        // Rank Bar
        {
        /// Get dates of rank
        var dates_of_rank = lib.get_dates_for_values_of_column(data, 'paygrade');

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
                    // .on('mouseover', function(event,d) {
                    //     // console.log(event);
                    //     // console.log(d.start);
                    //     // console.log(time_scale(d.start));
                    //     fitrep_highlight
                    //         .attr('transform', `translate(${time_scale(d.start)}, 0)`)
                    //         .attr('width', `${time_scale(d.end)-time_scale(d.start)}`)
                    //         .attr('height', `${rsca_scale.range()[0] - rsca_scale.range()[1]}`)
                    //         .transition()
                    //         .duration(200)
                    //         .style('opacity', 0.2);
                    //     })
                    //   .on('mouseout', function(d) {
                    //     fitrep_highlight
                    //       .style('opacity', 0);
                    //     });

        /// Create <text> for each rank
        rank_bar_groups.append('text')
                        .attr('transform', d => `translate(${0.5*(time_scale(d.end)-time_scale(d.start))},${0.5*lib.bar_height})`)
                        .style('text-anchor', 'middle')
                        .text(d => d.value)
                        .style('font-size', function(d) {
                            // var box = this.parentNode;
                            var rect_height = this.parentNode.children[0].getBBox().height;
                            var rect_width = this.parentNode.children[0].getBBox().width;
                            var num_chars = 0.65 * this.getNumberOfChars();

                            var return_val_in_px = Math.min(
                                0.65 * rect_height,
                                rect_width/num_chars
                            );

                            return (`${return_val_in_px}px`)
                        });

        rank_bar_groups
            .on('mouseover', function(event,d) {
                update_highlight_element(event, d, fitrep_highlight);
                }
            )
            .on('mouseout', function() {clear_fitrep_highlight(fitrep_highlight)});
        
                            
        }

        // Regular Commands bar
        {
        var command_dates = lib.get_dates_for_values_of_column(data, 'station', new RegExp('^(?!.*(AT|CC)).*$', 'g'), 'rpt_type');

        var command_bar_groups = command_g.selectAll('g')
                    .data(command_dates)
                    .enter()
                    .append('g')
                    .attr('transform', d => `translate(${time_scale(d.start)},0)`);

        command_bar_groups.append('rect')
                    .attr('height', 0.8*lib.bar_height)
                    .attr('width', d => time_scale(d.end)-time_scale(d.start))
                    .attr('stroke', 'black')
                    .attr('stroke-width', '2px')
                    .attr('fill', 'lightblue')
                    .attr('rx', '10px')
                    .attr('ry', '10px');

        command_bar_groups.append('text')
                        .attr('transform', d => `translate(${0.5*(time_scale(d.end)-time_scale(d.start))},${0.5*lib.bar_height})`)
                        .style('text-anchor', 'middle')
                        .text(d => d.value)
                        .style('font-size', function(d) {
                            var rect_height = this.parentNode.children[0].getBBox().height;
                            var rect_width = this.parentNode.children[0].getBBox().width;
                            var num_chars = 0.65 * this.getNumberOfChars();

                            var return_val_in_px = Math.min(
                                0.65 * rect_height,
                                rect_width/num_chars
                            );

                            return (`${return_val_in_px}px`);
                            
                        });

        command_bar_groups
            .on('mouseover', function(event,d) {
                update_highlight_element(event, d, fitrep_highlight);
                }
            )
            .on('mouseout', function() {clear_fitrep_highlight(fitrep_highlight)});
            }

        // Reporting Senior bar
        {
        var reporting_senior_dates = lib.get_dates_for_values_of_column(data, 'rs_name', new RegExp('^(?!.*(AT|CC)).*$', 'g'));

        var reporting_senior_groups = rep_sen_g.selectAll('g')
                    .data(reporting_senior_dates)
                    .enter()
                    .append('g')
                    .attr('transform', d => `translate(${time_scale(d.start)},0)`);
    
        reporting_senior_groups.append('rect')
                        .attr('height', 0.8*lib.bar_height)
                        .attr('width', d => time_scale(d.end)-time_scale(d.start))
                        .attr('fill', 'none')
                        .attr('stroke', 'black')
                        .attr('stroke-width', '2px')
                        .attr('fill', 'lightblue')
                        .attr('rx', '10px')
                        .attr('ry', '10px');
    
        reporting_senior_groups.append('text')
                        .attr('transform', d => `translate(${0.5*(time_scale(d.end)-time_scale(d.start))},${0.5*lib.bar_height})`)
                        .style('text-anchor', 'middle')
                        .text(d => {console.log(d.value); return(d.value)})
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
                        
        reporting_senior_groups
            .on('mouseover', function(event,d) {
                update_highlight_element(event, d, fitrep_highlight);
                }
            )
            .on('mouseout', function() {clear_fitrep_highlight(fitrep_highlight)});
        
        }
    

        // Concurrent Command bar
        {
        var non_regular_command_dates = lib.get_dates_for_values_of_column(data, 'station', new RegExp('(AT|CC)', 'g'), 'rpt_type');

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
                        .text(d => d.value)
                        .style('font-size', function(d) {
                            // var box = this.parentNode;
                            var rect_height = this.parentNode.children[0].getBBox().height;
                            var rect_width = this.parentNode.children[0].getBBox().width;
                            var num_chars = 0.65 * this.getNumberOfChars();

                            // console.log(rect_width);
                            // console.log(num_chars);
                            // console.log(rect_width/num_chars);

                            var return_val_in_px = Math.min(
                                0.65 * rect_height,
                                rect_width/num_chars
                            );

                            // return '10px';
                            return (`${return_val_in_px}px`);
                            
                        });

        command_cc_bar_groups
            .on('mouseover', function(event,d) {
                update_highlight_element(event, d, fitrep_highlight);
                }
            )
            .on('mouseout', function() {clear_fitrep_highlight(fitrep_highlight)});
        }

        // Concurrent Command Reporting Senior bar
        {
            var concurrent_command_reporting_senior_dates = lib.get_dates_for_values_of_column(data, 'rs_name', new RegExp('(AT|CC)', 'g'));

            var rep_sen_cc_bar_groups = rep_sen_cc_g.selectAll('g')
                        .data(concurrent_command_reporting_senior_dates)
                        .enter()
                        .append('g')
                        .attr('transform', d => `translate(${time_scale(d.start)},0)`);
        
            rep_sen_cc_bar_groups.append('rect')
                            .attr('height', 0.8*lib.bar_height)
                            .attr('width', d => time_scale(d.end)-time_scale(d.start))
                            .attr('fill', 'none')
                            .attr('stroke', 'black')
                            .attr('stroke-width', '2px')
                            .attr('fill', 'lightblue')
                            .attr('rx', '10px')
                            .attr('ry', '10px');
        
            rep_sen_cc_bar_groups.append('text')
                            .attr('transform', d => `translate(${0.5*(time_scale(d.end)-time_scale(d.start))},${0.5*lib.bar_height})`)
                            .style('text-anchor', 'middle')
                            .text(d => d.value)
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


            rep_sen_cc_bar_groups
                .on('mouseover', function(event,d) {
                    update_highlight_element(event, d, fitrep_highlight);
                    }
                )
                .on('mouseout', function() {clear_fitrep_highlight(fitrep_highlight)});
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
                        .attr('class', 'fitrep dot')
                        .attr('transform', function(d) {
                            return `translate(${time_scale(d.end_date)}, ${rsca_scale(d.trait_avg-d.rsca)})`
                        })
                        .append('text')
                        .style('text-anchor', 'middle')
                        // .attr("dy", "o.5em")
                        .text(d => {
                            var prom_rec = d.prom_rec.toUpperCase();
                            prom_rec = prom_rec==="NOB" ? "N" : prom_rec;
                            
                            var n = d.n_sp + d.n_pr + d.n_p + d.n_mp + d.n_ep;
                            
                            return (`${prom_rec.toUpperCase()}-${n}`);
                        })
                        .style('font-size', d => text_size_scale( d.n_sp + d.n_pr + d.n_p + d.n_mp + d.n_ep))
                        .on('mouseover', function(event,d) {
                            // console.log(event);
                            tooltip.transition()
                                .duration(400)
                                .style('opacity', 0.9);
                            
                            tooltip.html(lib.fitrep_tooltip(d))
                                .style('left', (event.pageX) + 'px')
                                .style('top', (event.pageY - 28) + 'px');
                            })
                          .on('mouseout', function(d) {
                            tooltip.transition()
                              .duration(400)
                              .style('opacity', 0);
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
                        .attr('class', 'fitrep line')
                        .append('path')
                        .attr('d', d => line(d))
                        .attr('fill', 'none')
                        .attr('stroke', '#000')
                        .attr('stroke-width', '2.5px')
                        .attr('opacity', 0.2);

        }

        // FITREP Gaps
        {
        fitreps_g.append('g')
            .attr('class', 'fitrep gap')
            .selectAll('rect')
            .data(fitrep_gaps)
            .enter()
            .append('rect')
            .attr('transform', d => `translate(${time_scale(d[0])},0)`)
            .attr('height', rsca_scale.range()[0])
            .attr('width', d => `${time_scale(d[1])-time_scale(d[0])}px`)
            .attr('fill', 'red')
            .attr('opacity', 0.2);
        }

}

    const populate_table = data => {
        console.log('populate table');

        // Add form header row
        var header = table.append('tr')
                                .attr('class', 'table_row header')
                                // .style('border-collapse', 'collapse')
                                .selectAll('th')
                                .data(lib.schema.fields)
                                .enter()
                                .append('th')
                                .attr('class', 'header_items')
                                .text(d => d.display)
                                // .style('margin', '10px')        

        // Add table rows
        var table_rows = table
                            // Enter a table row for each FITREP
                            .selectAll('tr.data_row')
                            .data(data)
                            .enter()
                            .append('tr')
                            .attr('class', 'data_row');

        // Add table row data cells
        var table_data_cells = table_rows
                            // Enter a table data for each key of the FITREP object
                            .selectAll('td')
                            .data(function(d) {
                                // console.log(Object.entries(d));
                                return(Object.entries(d));
                            })
                            // .data(  d => Object.entries(d)  )
                            .enter()
                            .append('td')
                            .classed('table_field', true)
                            .attr('key', d => d[0])
                            // Format and enter values for each field
                            .text(d => {
                                var [field, val] = d;
                                var schema_entry = lib.schema.fields.filter(el => el.name == d[0]);
                                var type = schema_entry[0] ? schema_entry[0].type : null;
        
                                if(type == 'text') val = val.toUpperCase();
                                if(type == 'date') val = lib.date_formatter(d[1]);
                                if(field == 'trait_avg') {
                                    // console.log(parseFloat(val));
                                    val = val ? Number.parseFloat(val).toFixed(2) : 0;
                                }
                                return val;
                            });

        // Add table row edit/save buttons
        var row_buttons = table_rows.append('td')
                                    .attr('class', 'button')
                                    .append('button')
                                    .attr('type', 'button')
                                    .attr('row_index', (d, i) => i)
                                    .text('edit')
                                    .on('click', lib.toggle_rows);

        }


    const clear_psr_viz = () => {
        d3.select(canvas)
            .select('#rank_g')
            .selectAll('g')
            .remove();

        d3.select(canvas)
            .select('#command_g')
            .selectAll('g')
            .remove();

        d3.select(canvas)
            .select('#rep_sen_g')
            .selectAll('g')
            .remove();

        d3.select(canvas)
            .select('#command_cc_g')
            .selectAll('g')
            .remove();

        d3.select(canvas)
            // .select('#command_cc_g')
            .selectAll('g.fitrep')
            .remove();
        
        d3.select(canvas)
            .selectAll('g.x.axis')
            .remove();     

        d3.select(canvas)
            .selectAll('g.y.axis')
            .remove();
    } 

    // const data = d3.csv('./data/helm.csv', d3.autoType)
    const data = d3.csv('./data/gardner.csv', d3.autoType)
        .then(data => {
            // Attach original data to ghost <g> to retain it
            d3.select('body')
              .append('g')
              .attr('id', 'original_data')
              .attr('original_data', data)
              .data(data);

            // Log data to console
            // console.log(data);
            return(data);
        })
        .then(data => {
            // Build table with PSR data
            populate_table(data);
            return(data);
        })
        // Draw viz
        .then(data => draw_psr_viz(data));


})


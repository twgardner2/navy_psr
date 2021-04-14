'use strict';


// Sizing variables
export const canvas_width = 1500;
export const canvas_height= 650;
export const margin = { top: 30, right: 30, bottom: 30, left: 30, gap: 10 };

export const labels_width = 150;

export const bar_width = 1000;
export const bar_height = 40;

export const fitrep_width = 1000;
export const fitrep_height = 300;

// Data schema

export var schema = {
    fields: [
        {name: 'name', type: 'text', display: 'Name', width: '100%'},
        {name: 'paygrade', type: 'text', display: 'Paygrade'},
        {name: 'station', type: 'text', display: 'Station'},
        {name: 'duty', type: 'text', display: 'Duty'},
        {name: 'start_date', type: 'date', display: 'Start Date'},
        {name: 'end_date', type: 'date', display: 'End Date'},
        {name: 'months', type: 'number', display: 'Months', width: '30px'},
        {name: 'rs_name', type: 'text', display: 'Reporting Senior Name'},
        {name: 'rs_paygrade', type: 'text', display: 'Reporting Senior Paygrade'},
        {name: 'rs_title', type: 'text', display: 'Reporting Senior Title'},

        {name: 'trait_1', type: 'number', display: '# of 1s', width: '30px'},
        {name: 'trait_2', type: 'number', display: '# of 2s', width: '30px'},
        {name: 'trait_3', type: 'number', display: '# of 3s', width: '30px'},
        {name: 'trait_4', type: 'number', display: '# of 4s', width: '30px'},
        {name: 'trait_5', type: 'number', display: '# of 5s', width: '30px'},


        {name: 'trait_avg', type: 'number', display: 'Trait Avg'},
        {name: 'rsca', type: 'number', display: 'Reporting Senior Cumulative Avg'},
        {name: 'prom_rec', type: 'text', display: 'Promotion Recommendation'},
        {name: 'n_sp', type: 'number', display: '# SP', width: '30px'},
        {name: 'n_pr', type: 'number', display: '# PR', width: '30px'},
        {name: 'n_p', type: 'number', display: '# P', width: '30px'},
        {name: 'n_mp', type: 'number', display: '# MP', width: '30px'},
        {name: 'n_ep', type: 'number', display: '# EP', width: '30px'},
        {name: 'prt', type: 'text', display: 'PRT'},
        {name: 'rpt_type', type: 'text', display: 'Report Type'},
    ]
};


// Formatters
export const date_formatter = new Intl.DateTimeFormat('en-US').format;

// Rank and Date of Rank variables

export function get_dates_of_rank(psr) {

    // Array of paygrades
    var paygrades = ['O1', 'O2', 'O3', 'O4', 'O5', 'O6', 'O7', 'O8', 'O9', 'O10'];

    // Array to populate with Dates of Rank
    var dates_of_rank = new Array(10);

    // Map over paygrades, returning earliest start_date for each
    dates_of_rank = paygrades.map((paygrade, i) => {

        // FITREPs for this paygrade
        var fitreps_this_paygrade = psr.filter(fitrep => fitrep.paygrade == paygrade);

        // If no FITREPs this paygrade, return null
        if(!fitreps_this_paygrade) return null;

        // Reduce FITREPs this paygrade down to earliest start_date
        var first_start_date_this_paygrade = fitreps_this_paygrade.reduce(
            function(acc, cur, idx, array) {
                var return_val; 
                
                if(idx == 0) {
                    return_val = cur.start_date;
                } else {
                    return_val = cur.start_date < acc ? cur.start_date : acc;
                }
                return return_val; 
          }, null
        )

        // Reduce FITREPs this paygrade down to latest end_date
        var last_end_date_this_paygrade = fitreps_this_paygrade.reduce(
            function(acc, cur, idx, array) {
                var return_val; 
                
                if(idx == 0) {
                    return_val = cur.end_date;
                } else {
                    return_val = cur.end_date > acc ? cur.end_date : acc;
                }
                return return_val; 
            }, null
        )

        // Return earliest FITREP start_date this paygrade
        return({'rank': `O${i+1}`,
                'start': first_start_date_this_paygrade,
                'end': last_end_date_this_paygrade});

    });
    console.log(dates_of_rank);

    return(dates_of_rank);
}


export function get_command_dates(psr, regex) {

    // Filter out FITREPS with rpt_type not matching regex
    var reg_fitreps = psr.filter(fitrep => {
        // console.log(fitrep.rpt_type);
        // console.log(fitrep.rpt_type.match(regex));
        return fitrep.rpt_type.match(regex);
    });

    // Get unique array of commands
    var commands = reg_fitreps.map(fitrep => {
        return fitrep.station;
    });
    var unique_commands = [... new Set(commands)];


    // Map over commands, returning earliest start_date for each
    var command_dates = unique_commands.map((command, i) => {

        // FITREPs for this command
        var reg_fitreps_this_command = reg_fitreps.filter(fitrep => fitrep.station == command);

        // Reduce FITREPs this command down to earliest start_date
        var first_start_date_this_command = reg_fitreps_this_command.reduce(
            function(acc, cur, idx, array) {
                var return_val; 
                
                if(idx == 0) {
                    return_val = cur.start_date;
                } else {
                    return_val = cur.start_date < acc ? cur.start_date : acc;
                }
                return return_val; 
            }, null
        )

        // Reduce FITREPs this command down to latest end_date
        var last_end_date_this_command = reg_fitreps_this_command.reduce(
            function(acc, cur, idx, array) {
                var return_val; 
                
                if(idx == 0) {
                    return_val = cur.end_date;
                } else {
                    return_val = cur.end_date > acc ? cur.end_date : acc;
                }
                return return_val; 
            }, null
        )

        // Return earliest FITREP start_date this paygrade
        return({'command': command,
                'start': first_start_date_this_command,
                'end': last_end_date_this_command});

    });
    
    return(command_dates);
}


export function fitreps_grouped_by_paygrade_and_repsen(psr) {
    var comparable_fitreps = d3.group(psr, d => d.paygrade, d => d.rs_name);
    // console.log(comparable_fitreps);

    var array_from_maps = [];
    comparable_fitreps.forEach(a => {
        // console.log(a);
        a.forEach(b => {
            // console.log(b);
            array_from_maps.push(b);
            
        });
    });

    return array_from_maps;



}

export function fitrep_gaps(psr) {

    var fitrep_dates = psr.map(d => [d.start_date, d.end_date]);
    
    var fitrep_gaps = fitrep_dates.map(function(el, i, array) {

        if (array[i+1]) {

            const one_day = 1*24*3600*1000;
            var end_this_fitrep = el[1];
            var day_after_end_this_fitrep = new Date(end_this_fitrep.getTime() + one_day);

            var start_next_fitrep = array[i+1][0];
            var day_before_start_next_fitrep = new Date(start_next_fitrep.getTime() - one_day);
    
            if(day_after_end_this_fitrep < start_next_fitrep) {
                return([day_after_end_this_fitrep, day_before_start_next_fitrep]);
            }

        } else {
            return undefined;
        }
    });

    return fitrep_gaps.filter(el => el != null);
}

export function fitrep_tooltip(d) {
    return (
        `${d.end_date} <br> ${d.rpt_type}`);
}


export function toggle_rows(e, d) {
    var clicked_button = d3.select(this);
    var parent_row = d3.select(this.parentNode.parentNode);
    // console.log(parent_row);

    // If not currently editing row
    if (  !this.classList.contains('editing')  ) {
        console.log('switch row to edit mode');

        // Toggle button text to 'save'
        clicked_button.text('save');

        // Give this row's <td>s and the button an 'editing' class
        clicked_button.classed('editing', true)
        parent_row.selectAll('td').classed('editing', true);

        // Append an <input> to each <td.table_field>
        parent_row.selectAll('td.table_field').each(function(d, i) {
            // console.log(d);
            // console.log(schema);
            var schema_entry = schema.fields.filter(el => el.name == d[0])[0];
            // console.log(schema_entry);

            var width = schema_entry && schema_entry.width ? schema_entry.width : "100%";

            var table_field = d3.select(this);
            var value = table_field.text();
            table_field.text('');
            table_field.append('input')
                .attr('value',value)
                .style('width', width);
            
        })

    // If currently editing row
    } else {
        console.log('switch row back to saved mode');

        
        // Remove <input> from each <td.table_field>, replace with value as text
        // console.log(parent_row.selectAll('td.table_field > input'));
        console.log(parent_row.selectAll('input'));
        parent_row.selectAll('td.editing').each(function(d, i) {
        // parent_row.selectAll('input').each(function(d, i) {
        // parent_row.selectAll('td.table_field > input').each(function(d, i) {
            // console.log(d);
            // console.log(schema);
            // var schema_entry = schema.fields.filter(el => el.name == d[0])[0];
            // console.log(schema_entry);

            // var width = schema_entry && schema_entry.width ? schema_entry.width : "100%";
            var td = d3.select(this);
            var row_input = td.select('input') //d3.select(this);
            console.log(row_input);
            // console.log(row_input._groups[0][0].value);
            var value = row_input._groups[0][0].value;
            console.log(value);

            // row_input.remove('input');
            row_input.remove();
            console.log(row_input);
            td.text(value);
            // row_input._groups[0][0].text(function(j) {
            //     return 'value';
            // });
            // self.text('');
            // self.append('input')
            //     .attr('value',value)
            //     .style('width', width);
            
            // Toggle button text to 'edit'
            clicked_button.text('edit');
    
            // Remove this row's <td>s and the button an 'editing' class
            clicked_button.classed('editing', false)
            parent_row.selectAll('td').classed('editing', false);

        })
    }

}






/////////////////////////////////////////////////////////////////////////////
// Old Code
/////////////////////////////////////////////////////////////////////////////

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
            {name: 'rs_title', type: 'text', display: 'Reporting Senior Title'},

            {name: 'trait_1', type: 'number', display: '# of 1s'},
            {name: 'trait_2', type: 'number', display: '# of 2s'},
            {name: 'trait_3', type: 'number', display: '# of 3s'},
            {name: 'trait_4', type: 'number', display: '# of 4s'},
            {name: 'trait_5', type: 'number', display: '# of 5s'},


            {name: 'trait_avg', type: 'number', display: 'Trait Avg'},
            {name: 'rsca', type: 'number', display: 'Reporting Senior Cumulative Avg'},
            {name: 'prom_rec', type: 'text', display: 'Promotion Recommendation'},
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
                .style('margin', '10px')
                // .text(d => d[1])
                .text(d => {
                    console.log(d);
                    var [field, val] = d
                    // var val = d[1];
                    var schema_entry = schema.fields.filter(el => el.name == d[0]);
                    // console.log(schema_entry);
                    var type = schema_entry[0] ? schema_entry[0].type : null;
                    console.log(type);

                    if(type == 'date') val = lib.date_formatter(d[1]);
                    if(field == 'trait_avg') {
                        console.log(parseFloat(val));
                        val = val ? Number.parseFloat(val).toFixed(2) : 0;
                    }


                    // console.log(d[0]);
                    return val;
                })

}

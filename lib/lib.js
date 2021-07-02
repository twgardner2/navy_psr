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

export const TOOLTIP_EP_font_color = 'chartreuse';
export const TOOLTIP_MP_font_color = 'darkgreen';
export const TOOLTIP_P_font_color = 'black';
export const TOOLTIP_PR_font_color = 'yellow';
export const TOOLTIP_SP_font_color = 'red';

// Data schema

export var schema = {
    fields: [
        {name: 'name', type: 'text', display: 'Name', width: '100%'},
        {name: 'paygrade', type: 'text', display: 'Paygrade', valid: ['O1','O2','O3','O4','O5','O6','O7','O8','O9','O10']},
        {name: 'station', type: 'text', display: 'Station'},
        {name: 'duty', type: 'text', display: 'Duty'},
        {name: 'start_date', type: 'date', display: 'Start Date'},
        {name: 'end_date', type: 'date', display: 'End Date'},
        {name: 'months', type: 'number', display: 'Months', width: '30px'},
        {name: 'rs_name', type: 'text', display: 'Reporting Senior Name'},
        {name: 'rs_paygrade', type: 'text', display: 'Reporting Senior Paygrade', valid: ['O1','O2','O3','O4','O5','O6','O7','O8','O9','O10']},
        {name: 'rs_title', type: 'text', display: 'Reporting Senior Title'},

        {name: 'trait_1', type: 'number', display: '# of 1s', width: '30px'},
        {name: 'trait_2', type: 'number', display: '# of 2s', width: '30px'},
        {name: 'trait_3', type: 'number', display: '# of 3s', width: '30px'},
        {name: 'trait_4', type: 'number', display: '# of 4s', width: '30px'},
        {name: 'trait_5', type: 'number', display: '# of 5s', width: '30px'},


        {name: 'trait_avg', type: 'number', display: 'Trait Avg'},
        {name: 'rsca', type: 'number', display: 'Reporting Senior Cumulative Avg'},
        {name: 'prom_rec', type: 'text', display: 'Promotion Recommendation', valid: ['NOB', 'SP','PR','P','MP','EP']},
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
            // var end_this_fitrep = el[1];
            var end_this_fitrep = new Date(el[1]);
            // console.log(end_this_fitrep);
            var day_after_end_this_fitrep = new Date(end_this_fitrep.getTime() + one_day);

            var start_next_fitrep = new Date(array[i+1][0]);
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

    // var eps = Array(d.n_ep).fill('EP').join('/').fontcolor(TOOLTIP_EP_font_color) + '<br>';
    // var mps = Array(d.n_mp).fill('MP').join('/').fontcolor(TOOLTIP_MP_font_color) + '<br>';
    // var ps = Array(d.n_p).fill('P').join('/').fontcolor(TOOLTIP_P_font_color) + '<br>';
    // var prs = Array(d.n_pr).fill('PR').join('/').fontcolor(TOOLTIP_PR_font_color) + '<br>';
    // var sps = Array(d.n_sp).fill('SP').join('/').fontcolor(TOOLTIP_SP_font_color) + '<br>';

    // var return_val = eps + mps + ps + prs + sps;

    var return_val = `
    ${d.n_ep ? `EP: ${d.n_ep}<br>` : ''}
    ${d.n_mp ? `MP: ${d.n_mp}<br>` : ''}
    ${d.n_p ? `P: ${d.n_p}<br>` : ''}
    ${d.n_pr ? `PR: ${d.n_pr}<br>` : ''}
    ${d.n_sp ? `SP: ${d.n_sp}<br>` : ''}
    `
    // MP: ${d.n_mp}<br>
    // P: ${d.n_p}<br>
    // PR: ${d.n_pr}<br>
    // SP: ${d.n_sp}<br>

    console.log(return_val);
    return(return_val);
    // return (
        // `${d.end_date} <br> ${d.rpt_type}`);
}


export function toggle_rows(e, d) {
    var clicked_button = d3.select(this);
    var parent_row = d3.select(this.parentNode.parentNode);

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

            var schema_entry = schema.fields.filter(el => el.name == d[0])[0];

            var width = schema_entry && schema_entry.width ? schema_entry.width : "100%";

            var table_field = d3.select(this);
            var value = table_field.text();
            table_field.text('');
            table_field.append('input')
                .attr('value',value)
                .style('width', width);
            
        })
    
    } else { // If currently editing row

        console.log('switch row back to saved mode');
        
        // Remove <input> from each <td.table_field>, replace with value as text
        parent_row.selectAll('td.editing').each(function(d, i) {

            // Save reference to <td>
            var td = d3.select(this);

            // If table_field, rather than the edit/save button
            if(td.classed('table_field')) {

                // Validate input: get data type, any valid values, check input for compliance
                var td_key = td.data()[0][0];
                var schema_entry = schema.fields.filter(el => el.name == td_key);
                var cell_data_type = schema_entry[0] ? schema_entry[0].type : null;
                var valid_values = schema_entry[0] ? schema_entry[0].valid: null;
                // console.log(cell_data_type);
                // console.log(valid_values);
                var new_value = td.select('input').node().value;

                if( cell_data_type == 'text' ) {
                    new_value = new_value.toUpperCase()
                }

                if( valid_values && !valid_values.includes(new_value) ) {
                    console.log(valid_values);
                    console.log(new_value);
                    alert('stop');
                }

                td.select('input').remove();
                td.text(new_value);
                
                // Toggle button text to 'edit'
                clicked_button.text('edit');
        
                // Remove this row's <td>s and the button an 'editing' class
                clicked_button.classed('editing', false)
                parent_row.selectAll('td').classed('editing', false);
            }

        });

        // // Construct object with row's new data
        // var row_new_data = {};

        // parent_row.selectAll('td.table_field').each(function(d, i, j) {
        //     var td = d3.select(this);

        //     var value = j[i].innerText;
        //     console.log(value);

        //     row_new_data[d[0]] = value

        //     // console.log(d);

        // });
        // console.log(row_new_data);
        // console.log(parent_row);
        // parent_row._groups[0][0].data(row_new_data);
        // // Update <tr>'s __data__ attribute with the row's new data
    }

}


export function update_tr_data() {

        console.log('test');

}

export function parse_data_from_table(e, d) {
    console.log('parse function');

    // Array to populate with data from table
    var parsed_data = [];

    // Selection of (non-header) table rows
    var table_data_rows = d3.selectAll('tr.data_row');
    console.log(table_data_rows);
    console.log(table_data_rows.data());


    d3.selectAll('tr.data_row').each(function(d, i, j) {
        var row_data = {};

        // console.log(j[i]);
        j[i].childNodes.forEach(function(el) {

            if(el.className == 'table_field') {

                // Get key and value in cell
                var cell_key = el.getAttribute('key');
                // console.log(cell_key);
                var cell_value = el.innerText;
                // console.log(cell_value);
                // Coerce to correct data type
                var schema_entry = schema.fields.filter(el => el.name == cell_key);
                var cell_data_type = schema_entry[0] ? schema_entry[0].type : null;
                var valid_values = schema_entry[0] ? schema_entry[0].valid: null;
                // console.log(cell_data_type);

                var typed_cell_value;
                if (cell_data_type == 'text'){ typed_cell_value = cell_value;}
                else if (cell_data_type == 'number'){ 
                    console.log(cell_key);
                    typed_cell_value = parseFloat(cell_value) || 0;
                    console.log(typed_cell_value);
                }
                // else if (cell_data_type == 'date') {typed_cell_value = Date.parse(cell_value).toISOString();}
                else if (cell_data_type == 'date') {
                    // console.log(cell_value);
                    // console.log('====================================')
                    var date = new Date(cell_value);
                    var month = date.getMonth()+1;
                    var day = date.getDate();
                    var year = date.getFullYear();
                    typed_cell_value = new Date(`${month}/${day}/${year}`)
                    // console.log(typed_cell_value);
                    // console.log('====================================')
                }
                // console.log(typed_cell_value);
                row_data[cell_key] = typed_cell_value;

                // console.log(row_data);
            }
        });
        // console.log(row_data);
        parsed_data.push(row_data);

    })
    // console.log(parsed_data);
    return parsed_data;
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

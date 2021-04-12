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

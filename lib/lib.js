'use strict';


// Sizing variables
export const margin = { top: 30, right: 30, bottom: 30, left: 30 }

export const bar_width = 1000;
export const bar_height = 40;

export const fitrep_width = 1000;
export const fitrep_height = 300;

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

    return(dates_of_rank);
}

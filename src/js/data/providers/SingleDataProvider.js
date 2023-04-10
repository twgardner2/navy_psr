import * as d3 from 'd3';
import { DataLoader } from './DataLoader';
import { AbstractProvider } from './AbstractProvider';
import { getActiveRecordName } from '../../stores/records';
import { getFlatPickr } from '../../stores/view-settings';

const { fields } = require('../schema');
const { getPageElements } = require('../../view/page-components.js');

export class SingleDataProvider extends AbstractProvider{
    constructor(recordName, psr) {
        super();
        this.recordName=recordName
        this.psr = this.parse(psr)
        for (let k in fields) {
            if (fields[k].dateFilter) {
                this[`get_${k}_dates`] = (reportFilter) =>
                    this.getDatesForValuesOfColumn(k, reportFilter);
            }
        }

        this.setDatesandTime()

    }

    getLastName(){
        const stop = this.recordName.indexOf('-');
        return this.recordName.substr(0, stop);
    }

    updateActiveRecord(data) {
        let loader=new DataLoader(data);
        loader.setRecordName(getActiveRecordName());
        loader.load();
    }

    getStartDate() {
        const start_dates = this.psr.map((d) => d.start_date);
        
        const earliest_psr= this.getEarliestDate(start_dates);
        const fp_date=getFlatPickr();
        
        return this.getLatestDate([earliest_psr, fp_date]);
    }

    getEndDate() {
        const end_dates = this.psr.map((d) => d.end_date);
        return new Date(Math.max(...end_dates));
    }

    fitrepsSameRsNewRank() {
        var fitreps_by_rs = d3.group(this.psr, (d) => d.rs_name);
        var array_from_maps = [];

        fitreps_by_rs.forEach((a) =>
            a.forEach((b, i) => {
                if (a[i + 1] && b.paygrade != a[i + 1].paygrade) {
                    array_from_maps.push([b, a[i + 1]]);
                }
            })
        );
        return array_from_maps;
    }

    fitrepGaps() {
        var fitrep_dates = this.psr.map((d) => [d.start_date, d.end_date]);

        var fitrep_gaps = fitrep_dates.map(function (el, i, array) {
            if (array[i + 1]) {
                const one_day = 1 * 24 * 3600 * 1000;
                var end_this_fitrep = new Date(el[1]);
                var day_after_end_this_fitrep = new Date(
                    end_this_fitrep.getTime() + one_day
                );

                var start_next_fitrep = new Date(array[i + 1][0]);
                var day_before_start_next_fitrep = new Date(
                    start_next_fitrep.getTime() - one_day
                );

                if (day_after_end_this_fitrep < start_next_fitrep) {
                    return [
                        day_after_end_this_fitrep,
                        day_before_start_next_fitrep,
                    ];
                }
            } else {
                return undefined;
            }
        });

        return fitrep_gaps.filter((el) => el != null);
    }

    getDatesForValuesOfColumn(col, reportFilter = {}) {
        //load with defaults and then overload with spread
        reportFilter = {
            regex: new RegExp('.*', 'gi'),
            filterColumn: 'rpt_type',
            ...reportFilter,
        };
        // Filter regex_col on regex, if specified
        var filtered_fitreps = this.psr.filter((fitrep) => {
            return fitrep[reportFilter.filterColumn].match(reportFilter.regex);
        });

        // Get unique values of col
        var unique_values_of_col = [
            ...new Set(filtered_fitreps.map((fitrep) => fitrep[col])),
        ];

        // return(unique_values_of_col);

        // Map over unique values, returning earliest start_date for each
        var dates = unique_values_of_col.map((value, i) => {
            // FITREPs for this value of col
            var fitreps_this_value_of_col = filtered_fitreps.filter(
                (fitrep) => fitrep[col] == value
            );

            // Reduce FITREPs this value of col down to earliest start_date
            var first_start_date_this_value_of_col =
                fitreps_this_value_of_col.reduce(function (
                    acc,
                    cur,
                    idx,
                    array
                ) {
                    var return_val;
                    if (idx == 0) {
                        return_val = cur.start_date;
                    } else {
                        return_val =
                            cur.start_date < acc ? cur.start_date : acc;
                    }
                    return return_val;
                },
                null);

            // Reduce FITREPs this command down to latest end_date
            var last_end_date_this_value_of_col =
                fitreps_this_value_of_col.reduce(function (
                    acc,
                    cur,
                    idx,
                    array
                ) {
                    var return_val;

                    if (idx == 0) {
                        return_val = cur.end_date;
                    } else {
                        return_val = cur.end_date > acc ? cur.end_date : acc;
                    }
                    return return_val;
                },
                null);

            // Return object with value of col, first FITREP start date, and last FITREP end_date
            return {
                value: value,
                start: first_start_date_this_value_of_col,
                end: last_end_date_this_value_of_col,
            };
        });

        return dates;
    }

    fitrepsGroupedByPaygradeAndRepsen() {
        var comparable_fitreps = d3.group(
            this.psr,
            (d) => d.paygrade,
            (d) => d.rs_name
        );

        var array_from_maps = [];
        comparable_fitreps.forEach((a) => {
            // console.log(a);
            a.forEach((b) => {
                // console.log(b);
                array_from_maps.push(b);
            });
        });

        return array_from_maps;
    }

    fitrepsGroupedByPaygrade(){
        return d3.group(
            this.psr,
            (d)=>d.paygrade
        );
    }

    getEndDateForPaygrade(paygrade){
        const fitreps=this.fitrepsGroupedByPaygrade().get(paygrade);
        if(typeof fitreps === 'undefined'){
            return false;
        }
        let endDates=[];

        for(let rep of fitreps){
            endDates.push(rep.end_date);
        }

        return this.getLatestDate(endDates);
        
    }

    getStartDateForPaygrade(paygrade){
        const fitreps=this.fitrepsGroupedByPaygrade().get(paygrade);
        if(typeof fitreps === 'undefined'){
            return false;
        }

        let startDates=[];

        for(let rep of fitreps){
            startDates.push(rep.start_date);
        }

        return this.getEarliestDate(startDates);
    }

}

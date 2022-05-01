const { count } = require("d3");
const { prom_rec_categories } = require("../lib")

module.exports.fields={
        "paygrade": {
            name: "paygrade",
            type: "text",
            display: "Paygrade",
            valid: ["O1", "O2", "O3", "O4", "O5", "O6", "O7", "O8", "O9", "O10"],
            dateFilter:true,
            pdf: {
                    rows:1,
                    text: " PG",
                    startLine:'center'
                },
            },
        "station": { 
            name: "station", 
            type: "text", 
            display: "Station",
            dateFilter: true,
            pdf:{
                rows:2,
                text: " STATION",
                startLine: 'top'
            }
        },
        "duty": { 
            name: "duty", 
            type: "text", 
            display: "Duty",
            pdf:{
                rows:2,
                text:" DUTY",
                startLine: 'top'
            }
        },
        "start_date": { 
            name: "start_date", 
            type: "date", 
            display: "Start Date",
            pdf:{
                rows:1,
                text:" DATES",
                startLine:'top'
            }
        },
        "end_date": {
             name: "end_date", 
             type: "date", 
             display: "End Date",
             pdf: {
                rows:1,
                text:" DATES",
                startLine:'bottom'
            }
        },
        "months": { 
            name: "months", 
            type: "calculated",
            calculated:{
                watch: ['start_date', 'end_date'],
                calculate: (d3Row)=>{
                    let date1=d3Row.select('td[data-key="start_date"] input')
                        .node()
                        ._flatpickr
                        .selectedDates[0];
                    let date2=d3Row.select('td[data-key="end_date"] input')
                        .node()
                        ._flatpickr
                        .selectedDates[0];
                    let months = (date2.getFullYear() - date1.getFullYear()) * 12;
                    months -= date1.getMonth();
                    months += date2.getMonth();
                    return months <= 0 ? 0 : months;
                }
            },
            display: "Months", 
            width: "30px",
            pdf:{
                rows:1,
                text: " M",
                startLine:'center'
            }
        },
        "rs_name": { 
            name: "rs_name", 
            type: "text", 
            display: "Reporting Senior Name",
            dateFilter: true,
            pdf:{
                parentColumn:"ReportingSenior"
            }
        },
        "rs_paygrade": {
            name: "rs_paygrade",
            type: "text",
            display: "Reporting Senior Paygrade",
            dateFilter: true,
            valid: ["O1", "O2", "O3", "O4", "O5", "O6", "O7", "O8", "O9", "O10"],
            pdf:{
                parentColumn:"ReportingSenior"
                }   
        },
        "rs_title": { 
            name: "rs_title", 
            type: "text", 
            display: "Reporting Senior Title",
            pdf:{
                parentColumn: "ReportingSenior"
            }
        },
        "trait_1":{ 
            name: "trait_1", 
            type: "number", 
            display: "# of 1s", 
            width: "30px",
            optional:true,
            pdf: {
                parentColumn: "Traits"
            }
        },
        "trait_2":{ 
            name: "trait_2", 
            type: "number", 
            display: "# of 2s", 
            width: "30px",
            optional: true,
            pdf: {
                parentColumn: "Traits"
            }
        },
        "trait_3":{ 
            name: "trait_3", 
            type: "number", 
            display: "# of 3s", 
            width: "30px",
            optional: true,
            pdf: {
                parentColumn: "Traits"
            }
        },
        "trait_4":{
             name: "trait_4", 
             type: "number", 
             display: "# of 4s", 
             width: "30px",
             optional: true,
             pdf: {
                parentColumn: "Traits"
            }
            },
        "trait_5":{ 
            name: "trait_5", 
            type: "number", 
            display: "# of 5s", 
            width: "30px",
            optional: true,
            pdf: {
                parentColumn: "Traits"
            }
        },
        "trait_avg":{ 
            name: "trait_avg", 
            type: "calculated",
            calculated:{
                watch: ['trait_1', 'trait_2', 'trait_3', 'trait_4', 'trait_5'],
                calculate: (d3Row)=>{
                    let values=this.fields.trait_avg.calculated.watch.map(key=>
                        Number(d3Row.select(`td[data-key="${key}"] input`).node().value)
                    );
                    let observed=values.reduce((a,b)=>a+b);
                    if(observed === 0){
                        return '';
                    }

                    let sum=0;
                    values.forEach((count, i)=>
                        sum+=(i+1)*count
                    );

                    return (sum/observed).toFixed(2);
                }   
            },
            display: "Trait Avg",
            pdf: {
                parentColumn: "Averages"
            }
        },
        "rsca":{
            name: "rsca",
            type: "number",
            display: "Reporting Senior Cumulative Avg",
            pdf: {
                parentColumn: "Averages"
            }    
        },
        "prom_rec":{
            name: "prom_rec",
            type: "text",
            display: "Promotion Recommendation",
            valid: prom_rec_categories,
        },
        "n_sp":{ 
            name: "n_sp", 
            type: "number", 
            display: "# SP", 
            width: "30px",
            pdf:{
                rows:1,
                startLine:'bottom',
                text: "SP"
            }
        },
        "n_pr":{ 
            name: "n_pr", 
            type: "number", 
            display: "# PR", 
            width: "30px",
            pdf:{
                rows:1,
                startLine:'bottom',
                text:"PR"
            }
        },
        "n_p": { 
            name: "n_p", 
            type: "number", 
            display: "# P", 
            width: "30px",
            pdf:{
                rows:1,
                startLine:'bottom',
                text: "P"
            }
        },
        "n_mp": { 
            name: "n_mp", 
            type: "number", 
            display: "# MP", 
            width: "30px",
            pdf:{
                rows:1,
                startLine:'bottom',
                text:"MP"
            } 
        },
        "n_ep": { 
            name: "n_ep", 
            type: "number", 
            display: "# EP", 
            width: "30px",
            pdf:{
                rows:1,
                startLine:'bottom',
                text: "EP"
            } 
        },
        "prt": { 
            name: "prt", 
            type: "text", 
            display: "PRT",
            pdf:{
                rows:1,
                startLine:'top',
                text: "PRT"
            } 
        },
        "rpt_type" :{ 
            name: "rpt_type", 
            type: "text", 
            display: "Report Type" ,
        },
}
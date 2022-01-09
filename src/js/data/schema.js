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
            type: "number", 
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
            type: "number", 
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
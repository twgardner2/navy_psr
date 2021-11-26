
const { convertToThou } = require('./helpers');


function identifyColumns(page) {
    let cols={
        "Paygrade":{
            rows:1,
            text: " PG",
            startLine:'center'
        },
        "STATION":{
            rows:2,
            text: " STATION",
            startLine: 'top'
        },
        "DUTY":{
            rows:2,
            text:" DUTY",
            startLine: 'top'
        },
        "Months":{
            rows:1,
            text: " M",
            startLine:'center'
        },
        "Start_Date":{
            rows:1,
            text:" DATES",
            startLine:'top'
        },
        'End_Date':{
            rows:1,
            text:" DATES",
            startLine:'bottom'
        },
        "ReportingSenior":{
            text:"   NAME       PG      TITLE",
            subColumns:true
        },
        "TRAITS":{
            text:"   TRAITS",
            subColumns: true
        },
        "AVERAGES":{
            text: 'IND            R/S',
            subColumns:true
        },
        "SP":{
            rows:1,
            startLine:'top',
            required:false
        },
        "SPSum":{
            rows:1,
            startLine:'bottom',
            text: "SP"
        },
        "PR":{
            rows:1,
            startLine:'top',
            required:false
        },
        "PRSum":{
            rows:1,
            startLine:'bottom',
            text:"PR"
        },
        "P":{
            rows:1,
            startLine:'top',
            required:false
        },
        "PSum":{
            rows:1,
            startLine:'bottom',
            text: "P"
        },
        "MP":{
            rows:1,
            startLine:'top',
            required:false
        },
        "MPSum":{
            rows:1,
            startLine:'bottom',
            text:"MP"
        },
        "EP":{
            rows:1,
            startLine:'top',
            required:false
        },
        "EPSum":{
            rows:1,
            startLine:'bottom',
            text: "EP"
        },
        "PRT":{
            rows:1,
            startLine:'top'
        },
        "RPT":{
            rows:1,
            startLine:'bottom'
        },
        "RPTAdditional":{
            rows:1,
            startLine:'top',
            required:false,
            text: "RPT"
        }
    };

   let metaItems=getMetaItems(page);
    let text, found;
    
    for(let k in cols){
        text=cols[k].text || k;
        found=metaItems.filter(item=>item.text===text);
        if(found.length>1){
            console.log(`Duplicates found for ${k}:
            ${JSON.stringify(found)}`);
        } else if(found.length===1){
            cols[k]={...cols[k], ...mapItemToColItem(found[0])};
        }
    }
    cols=addTraits(cols, metaItems);
    return parseAverages(
        parseReportingSenior(cols));
}

function addTraits(cols, metaItems){
    let traitScore;
    for(let i=1; i<=5; i++){
        traitScore= metaItems
                .filter(item=>item.xThou > cols.ReportingSenior.xThou &&
                    item.xThou < cols.AVERAGES.xThou &&
                    item.y > cols.TRAITS.y &&
                    item.text.indexOf(`${i}`)!==-1);
        if(traitScore.length !== 1){
            console.log( `Couldn't find Trait Col ${i}`)
        }
        cols[`Trait_${i}`]={...mapItemToColItem(traitScore[0]), rows:1, startLine:'center'};
    }
    return cols;
}

function mapItemToColItem(item){
    return {
        xThou: convertToThou(item.x),
        y: item.y
    };
}

function getMetaFloor(page){
    return page.filter(item=>item.text === 'SUM          CUM')[0]['y'];
}

function getMetaItems(page){
    return page
    .filter(item=>item.y<getMetaFloor(page))
    .map(item=>{
        return {
            ...item,
            xThou:convertToThou(item.x)
        };
    });
}

function parseAverages(cols) {
    cols.Trait_Average={
        xThou:cols.AVERAGES.xThou,
        rows:1,
        startLine:'top'
    }
    cols.GrpTraitAvg={
        xThou:cols.AVERAGES.xThou,
        rows:1,
        startLine:'bottom'
    }
    cols.RSCumNum={
        xThou:cols.AVERAGES.xThou+2500,
        rows:1,
        startLine:'top'
    }
    cols.RSCA={
        xThou:cols.AVERAGES.xThou+2500,
        rows:1,
        startLine:'bottom'
    }
    return cols;
}

function parseReportingSenior(cols){
    cols.RS_Name={
        xThou:cols.ReportingSenior.xThou+0,
        rows:2,
        startLine:'top'
    };
    cols.RS_Paygrade={
        xThou:cols.ReportingSenior.xThou+3438,
        rows:1,
        startLine: 'center'
    };
    cols.RS_Title={
        xThou:cols.ReportingSenior.xThou+5313,
        rows:2,
        startLine: 'top'
    }
    return cols;
}

module.exports={
    identifyColumns,
    getMetaFloor
}
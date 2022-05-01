
const { convertToThou } = require('./helpers');
const { fields } = require('../../schema');


function buildCols(){
    const parentCols={
        "ReportingSenior":{
            text:"   NAME       PG      TITLE",
            subColumns:true
        },
        "Traits":{
            text:"   TRAITS",
            subColumns: true
        },
        "Averages":{
            text: 'IND            R/S',
            subColumns:true
        }
    };

    const promRecommendationCols={
        "sp":{
            rows:1,
            startLine:'top',
            text: 'SP',
            required:false
        },
        "pr":{
            rows:1,
            startLine:'top',
            text:'PR',
            required:false
        },
        "p":{
            rows:1,
            startLine:'top',
            text:'P',
            required:false
        },
        "mp":{
            rows:1,
            startLine:'top',
            text: 'MP',
            required:false
        },
        "ep":{
            rows:1,
            startLine:'top',
            text:'EP',
            required:false
        }
    }

    const reportCols={
        "RPT":{
            rows:1,
            startLine:'bottom',
            text: "RPT"
        },
        "RPTAdditional":{
            rows:1,
            startLine:'top',
            required:false,
            text: "RPT"
        }
    };

    const mapSchemaToSpecials={
        "prom_rec": promRecommendationCols,
        "rpt_type": reportCols
    }

    let cols={};
    for(let k in fields){
        if(fields[k].pdf && !fields[k].pdf.parentColumn){
            //if there is a pdf att without a parent identified, add it to cols
            cols[k]=fields[k].pdf;

        } else if ( fields[k].pdf && fields[k].pdf.parentColumn ){
            let parent=fields[k].pdf.parentColumn;
            if(!parentCols[parent]){
                throw `No Parent Column set up for ${parent}`
            }
            // if there is a pdf att with a parent, add the parent
            cols[parent]=parentCols[parent];
            
        } else if ( !fields[k].pdf ){
            // if there's no pdf, check special mapping and spread it on
            if(mapSchemaToSpecials[k]){
                cols={...cols, ...mapSchemaToSpecials[k]}
            } else {
                throw `No PDF mapping for Schema Field ${k}`;
            }
        }
    }

    return cols;
}

function identifyColumns(page) {
   let cols=buildCols();

   let metaItems=getMetaItems(page);
   
   let text, found;
    
    for(let k in cols){
        text=cols[k].text;

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
                    item.xThou < cols.Averages.xThou &&
                    item.y > cols.Traits.y &&
                    item.text.indexOf(`${i}`)!==-1);
        if(traitScore.length !== 1){
            console.log( `Couldn't find Trait Col ${i}`)
        }
        cols[`trait_${i}`]={...mapItemToColItem(traitScore[0]), rows:1, startLine:'center'};
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
    cols.trait_avg={
        xThou:cols.Averages.xThou,
        rows:1,
        startLine:'top'
    }
    cols.GrpTraitAvg={
        xThou:cols.Averages.xThou,
        rows:1,
        startLine:'bottom'
    }
    cols.RSCumNum={
        xThou:cols.Averages.xThou+2500,
        rows:1,
        startLine:'top'
    }
    cols.sum_group={
        xThou:cols.Averages.xThou,
        rows:1,
        startLine:'bottom'
    }
    cols.rsca={
        xThou:cols.Averages.xThou+2500,
        rows:1,
        startLine:'bottom'
    }
    return cols;
}

function parseReportingSenior(cols){
    cols.rs_name={
        xThou:cols.ReportingSenior.xThou+0,
        rows:2,
        startLine:'top'
    };
    cols.rs_paygrade={
        xThou:cols.ReportingSenior.xThou+3438,
        rows:1,
        startLine: 'center'
    };
    cols.rs_title={
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
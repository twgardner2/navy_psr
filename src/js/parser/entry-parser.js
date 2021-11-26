
const { convertToThou } = require('./helpers');
const obs=['EP','MP','P','PR','SP'];

function parseEntryRows(entryRows, cols) {
    colsArr=Object.keys(cols).map(k=>{
        return {...cols[k], 'key':k};
    });

     return entryRows
        .map(row=>{
            return { ...row,
                items: row.items.map(item=>{
                    return {
                        ...item,
                        xThou:convertToThou(item.x),
                        yThou:convertToThou(item.y)
                    };
                })
            }
        })
        .map(row=>{
        return {
            ...parseDoubles(row, colsArr),
            ...parseToplines(row, colsArr),
            ...parseBottomLines(row, colsArr),  
            ...parseCenterlines(row, colsArr),
            ...parseTraits(row, colsArr),
            ...parsePromRec(row, cols), //NOTE: Elements with fussy positions need cols
            ...parse_N(row, cols), 
            ...parseRptType(row, cols),
            ...parseMonths(row, cols)
        }
    })
}

function parseDoubles(row, colsArr){
   let out={};
   let doubles=colsArr
      .filter(col=>col.rows===2)
      .map(col=>{
          let items=row.items.filter(i=>i.xThou===col.xThou);
          if(items.length === 0){
              return;
          }
          let item=items.length===2 ? `${items[0].text}${items[1].text}` : items[0].text;
          out= {...out, [col.key]:item};
      })
    return out;
}

function parseCenterlines(row, colsArr){
    let out={};
    let centerlines=colsArr
        .filter(col=>col.startLine==='center')
        .map(col=>{
            let item=row.items.filter(i=>i.xThou===col.xThou)[0];
            if(!item){
                return
            }
            out= {...out, [col.key]:item.text};
        });
    return out;
}

function parseToplines(row, colsArr){
    let out={};
    colsArr
        .filter(col=>col.startLine==='top' && col.rows===1) 
        .map(col=>{
            let item=row.items.filter(i=>i.xThou===col.xThou &&
                i.yThou === row.top)[0];
            if(!item){
                return
            }
            out= {...out, [col.key]:item.text};
        });
    return out;
}

function parseBottomLines(row, colsArr){
    let out={};
    colsArr
        .filter(col=>col.startLine==='bottom' && col.rows===1) 
        .map(col=>{
            let item=row.items.filter(i=>i.xThou===col.xThou &&
                i.yThou === row.bottom)[0];

            if(!item){
                return;
            }
            out= {...out, [col.key]:item.text};
        });
    return out;
}

function parsePromRec(row, cols){
    
    let recMark=row.items
        .filter(item=>item.text===' X' &&
            item.xThou<cols.EP.xThou)[0] || false;
    if(!recMark){
        return {PROM_REC: 'NOBS'}
    }
    
    let rec;
    obs.forEach(ob=>{
        if(recMark.xThou< cols[ob].xThou){
            rec=ob;
        }
    });
    if(!rec){
        console.log(JSON.stringify(recMark));
        throw Error('Unable to find valid PROM_REC')
    }

    return {PROM_REC: rec};
}

function parseTraits(row, colArr){
    let out={};
    colArr
        .filter(col=>col.key.indexOf('Trait')===0)
        .map(col=>{
            let xThou=col.xThou - 100 //PSR allignment is 100 off
            let item=row.items.filter(item=>item.xThou === xThou )[0];
            if(item){
                out={...out, [col.key]:parseInt(item[0].text)}
            }
        });
        return out;
}

function parse_N(row, cols){
    const regex=/^ *\d+$/;
    let numArr=row.items
            .filter(item=>item.yThou === row.bottom &&
            item.xThou > cols.RSCA.xThou)
            .filter(item => regex.test(item.text))
            .reverse();

    if(numArr.length !== obs.length){
        throw Error(`${numArr.length} Prom Recs found ${obs.length} expected`);
    }

    let out={}
    obs.forEach((ob, index)=>{
        out={...out, [`n_${ob}`]:parseInt(numArr[index].text)}
    });
    return out;
}

function parseRptType(row, cols){
    const offset=250;
    const key='RPT_TYPE'
    let rpt=row.items.filter(item=> item.yThou === row.bottom &&
        item.xThou+offset===cols.RPT.xThou)[0];
    let rptAdd=row.items.filter(item=> item.yThou === row.top &&
        item.xThou+offset===cols.RPT.xThou)[0];
    if(rptAdd){
        value=`${rptAdd.text}/${rpt.text}`;
    } else {
        value=rpt.text
    }
    return {[key]: value}
}

function parseMonths(row, cols){
    let items=row.items.filter(item=> item.yThou === row.center &&
        item.xThou>cols.Start_Date.xThou && item.xThou<=cols.Months.xThou);
    if(items[0]){
        return {'Months' : parseInt(items[0].text)};
    }
}

module.exports={
    parseEntryRows   
}
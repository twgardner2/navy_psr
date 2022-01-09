
const { PdfReader} = require('pdfreader');

const { convertToThou } = require('./helpers');

const { identifyColumns, getMetaFloor} = require('./col-parser');
const { parseEntryRows} = require('./entry-parser');
const { Buffer } = require('buffer');
const { resolve } = require('path');

//To Read from Buffer use parseBuffer.
async function loadPages(buffer) {
    return new Promise((resolve, reject)=>{
        let pages = {};
        let currentPage;
        new PdfReader().parseBuffer(buffer, function(err, item) {
            if(err){
                console.log(err);
            } else if (item && item.page){
                currentPage = `page${item.page}`;
                pages[currentPage] = [];
            } else if (item && item.text){
                    pages[currentPage].push(item);
            } else if (!item){
                resolve(pages)
            }
        });
    });
}

function parsePage(page) {
    let cols=identifyColumns(page);
    let entryRows= getEntryRows(page, cols);
    let entries = fixDates(parseEntryRows(entryRows, cols));
    return entries;
}

function fixDates(entries){
    return entries.map(entry=>({
        ...entry,
        start_date:dateFixer(entry.start_date),
        end_date: dateFixer(entry.end_date)
        })
    )
}

function dateFixer( mmddyyString){
    let month= parseInt(mmddyyString.slice(0,2))-1 // 0 index for month index
    let day= mmddyyString.slice(2,4);
    let year= mmddyyString.slice(4,6);
    let mil= parseInt(year) > 80 ? '19' : '20';
    return new Date(mil+year, month, day);
}

function getEntryRows(page, cols) {
    let entryItems=page.filter(item=>item.y>=getMetaFloor(page));
    
    let centerLines=entryItems
    .filter(item=>convertToThou(item.x)===cols.paygrade.xThou) //one pagegrade centered on each line
    .map(item=>convertToThou(item.y))
    .map( cl=>{
        return {
            'center':cl,
            'top':cl-312,
            'bottom': cl+313
        }
    });

    return centerLines
        .map(row=>{
            return {
            ...row,
            items:page.filter(i=>convertToThou(i.y)>=row.top && convertToThou(i.y)<=row.bottom)
            }
        });
}


export async function parseFileInputToEntries(input){
    let file = input.files[0]; 
    return new Promise((resolve, reject)=>{
        file.arrayBuffer().then( arrayBuffer=>{
            let buffer = Buffer.from(arrayBuffer);
            loadPages(buffer).then(pages=>{
                let entries = Object.keys(pages)
                .map(page=>parsePage(pages[page]))
                .flat();
                resolve(entries);
            });
        });
    });
}
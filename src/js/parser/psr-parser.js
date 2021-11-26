
const { PdfReader} = require('pdfreader');

const { convertToThou } = require('./helpers');

const { identifyColumns, getMetaFloor} = require('./col-parser');
const { parseEntryRows} = require('./entry-parser');


//To Read from Buffer use parseBuffer.
function loadPages(filename) {
    let pages = {};
    let currentPage;
    new PdfReader().parseFileItems(filename, function(err, item) {
        if(err){
            console.log(err);
        } else if (item && item.page){
            currentPage = `page${item.page}`;
            pages[currentPage] = [];
        } else if (item && item.text){
                pages[currentPage].push(item);
        }
    });
    return pages;
}

function parsePage(page) {
    let cols=identifyColumns(page);
    let entryRows= getEntryRows(page, cols);
    let entries = parseEntryRows(entryRows, cols);
    return entries;
}

function getEntryRows(page, cols) {
    let entryItems=page.filter(item=>item.y>=getMetaFloor(page));
    
    let centerLines=entryItems
    .filter(item=>convertToThou(item.x)===cols.Paygrade.xThou) //one pagegrade centered on each line
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


function parseUploadedForm(e){
    e.preventDefault();
    let files= e.files

}

const {DataProvider} = require('./data/providers/DataProvider');

const { parseFileInputToEntries } = require("./data/parsers/pdf/psr-parser");

const {draw_psr_viz}= require("./graph/graph.js");

const {resetGraph}= require("./page-components");

let parentElem;

export function appendPDFUploadForm(parent){
    parentElem=parent;
    let wrapper=parent
        .append("div")
        .attr("id","pdf-parser-wrapper");

        wrapper
        .append("label")
        .attr("for", 'pdf-parser')
        .html("Select PSR PDF for Parsing")

        wrapper
            .append("input")
            .attr('type', 'file')
            .attr('accept', '.pdf')
            .on('change', updateFromPdfInputChange);
}

function updateFromPdfInputChange(event){
    let elem=event.target
    parseFileInputToEntries(elem)
        .then(data=>{
            resetGraph(parentElem);
            console.log(data);
            draw_psr_viz( new DataProvider(data) );
        })
}
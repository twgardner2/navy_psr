import { DataLoader } from '../data/providers/DataLoader';
import { removeRecordByName, nameToId } from '../stores/records';

const {
    parseFileInputToEntries,
    parseFileInputToName,
} = require('../data/parsers/pdf/psr-parser');

let parentElem;

export function appendPDFUploadForm(parent) {
    parentElem = parent;
    let wrapper = parent
        .append('div')
        .attr('id', 'pdf-parser-wrapper')
        .style('display', 'flex')
        .style('justify-content', 'space-evenly')
        .style('align-items', 'center');

    wrapper
        .append('label')
        .attr('for', 'pdf-parser')
        .html('Upload PSR PDF:')
        .style('font-weight', 'bold')
        .style('font-size', 'larger');

    wrapper
        .append('input')
        .attr('type', 'file')
        .attr('accept', '.pdf')
        .on('change', updateFromPdfInputChange);
}

async function updateFromPdfInputChange(event) {
    let elem = event.target;
    let data = await parseFileInputToEntries(elem);
    let psrName = await parseFileInputToName(elem);

    let loader = new DataLoader(data);

    loader.setRecordName(nameToId(psrName));
    loader.load();

    if (document.getElementById('Sample')) {
        // removeRecordByName('Sample');
    }

    elem.value = '';
}

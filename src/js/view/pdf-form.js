import { DataLoader } from '../data/providers/DataLoader';
import { sample_name } from '../lib';
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
        .style('align-items', 'center');

    let label=wrapper
        .append('label')
        .attr('for', 'pdf-parser')
        .html(`Add PSRs:`)
        .style('font-weight', 'bold')
        .style('font-size', 'larger')
        .style('margin-right', '0.5em');
        label
            .append('p')
            .html('(you can add several <br>to compare individuals)')
            .style('margin-top', '0')
            .style('font-size', '0.75em')

    wrapper
        .append('input')
        .attr('type', 'file')
        .attr('accept', '.pdf')
        .attr('multiple', true) // Allow multiple file selection
        .on('change', updateFromPdfInputChange);
}

async function updateFromPdfInputChange(event) {
    let elem = event.target;
    let files = elem.files; // Get all selected files

    for (let i = 0; i < files.length; i++) {
        let file = files[i];

        // Assuming parseFileInputToEntries and parseFileInputToName can handle individual files
        let data = await parseFileInputToEntries(file);
        let psrName = await parseFileInputToName(file);

        let loader = new DataLoader(data);

        loader.setRecordName(nameToId(psrName));
        loader.load();

        if (document.getElementById(sample_name)) {
            removeRecordByName(sample_name);
        }
    }

    elem.value = ''; // Clear the input after processing all files
}

import * as d3 from 'd3';
import * as lib from '../lib.js';
import flatpickr from "flatpickr";

const { getPageElements } = require('../page-components.js');

const { fields } = require('../data/schema');
const { resetTable } = require('../page-components');

const tableFields = Object.values(fields);

export const populate_table = (data) => {
    const table = resetTable();

    // Add form header row
    var header = table
        .append('tr')
        .attr('class', 'table_row header')
        // .style('border-collapse', 'collapse')
        .selectAll('th')
        .data(tableFields)
        .enter()
        .append('th')
        .attr('class', 'header_items')
        .text((d) => d.display);
    // .style('margin', '10px')

    data.psr.forEach((entry) => {
        let row = table.append('tr').attr('class', 'data_row');

        buildRow(row, entry);
    });
};

function toggle_rows(e, d) {
    var clicked_button = d3.select(this);
    var parent_row = d3.select(this.parentNode.parentNode);

    // If not currently editing row
    if (!this.classList.contains('editing')) {
        // Toggle button text to 'save'
        clicked_button.text('Save');

        // Give this row's <td>s and the button an 'editing' class
        clicked_button.classed('editing', true);
        parent_row.selectAll('td').classed('editing', true);

        // Append an <input> to each <td.table_field>
        parent_row.selectAll('td.table_field').each(function (d, i) {
            var schema_entry = fields[this.dataset.key];

            var width =
                schema_entry && schema_entry.width
                    ? schema_entry.width
                    : '100%';

            var table_field = d3.select(this);
            var value = this.innerHTML;
            table_field.text('');
            table_field
                .append('input')
                .attr('value', value)
                .style('width', width);
            
            if(schema_entry.type === 'date'){
                table_field.node().classList.add('date-field');
            }
        });
        flatpickr(".date-field input", {
            position: "above left",
            dateFormat: "m/d/Y"
        });
    } else {
        // If currently editing row

        // Remove <input> from each <td.table_field>, replace with value as text
        parent_row.selectAll('td.editing').each(function (d, i) {
            if (this.innerHTML.indexOf('input') === -1) {
                return;
            }

            // Save reference to <td>
            var td = d3.select(this);

            // If table_field, rather than the edit/save button
            if (td.classed('table_field')) {
                // Validate input: get data type, any valid values, check input for compliance
                var td_key = this.dataset.key;
                var schema_entry = fields[td_key];
                var cell_data_type = schema_entry.type || null;
                var valid_values = schema_entry.valid || null;
                // console.log(cell_data_type);
                // console.log(valid_values);
                var new_value = td.select('input').node().value;

                if (cell_data_type == 'text') {
                    new_value = new_value.toUpperCase();
                }

                if (valid_values && !valid_values.includes(new_value)) {
                    alert(`Invalid Value for ${td_key}`);
                    throw 'Saving stopped to correct value error';
                }

                td.select('input').remove();
                td.text(new_value);
            }
        });

        // Toggle button text to 'edit'
        clicked_button.text('Edit');

        // Remove this row's <td>s and the button an 'editing' class
        clicked_button.classed('editing', false);
        parent_row.selectAll('td').classed('editing', false);
        redrawGraph();
    }
}

function deleteRow(e, d) {
    var parent_row = d3.select(this.parentNode.parentNode);
    parent_row.remove();
    redrawGraph();
}

function addRow(e, d) {
    let next_row = this.parentNode.parentNode.nextSibling;
    let table = d3.select(this.parentNode.parentNode.parentNode);
    let new_row;

    if (next_row) {
        let next_selector = `tr:nth-child(${next_row.rowIndex + 1})`;
        table.insert('tr', next_selector);
        new_row=table.select(next_selector);

    } else {
        new_row = table.append('tr');
    }

    buildRow(new_row);
    new_row.select('button.edit').node().click();
}

function buildRow(row, entry = {}) {
    Object.keys(fields).forEach((key) => {
        row.append('td')
            .attr('class', 'table_field')
            .attr('data-key', key)
            .text(processPSRField(entry, key));
    });

    buildButtonCell(row);
    return row;
}

function processPSRField(entry, key) {
    if (!entry[key]) {
        return '';
    }

    let type = fields[key].type || 'text';
    let val = entry[key];
    if (type === 'text') val = val.toUpperCase();
    if (type === 'date') val = lib.date_formatter(val);
    if (key === 'trait_avg') {
        val = val ? Number.parseFloat(val).toFixed(2) : 0;
    }
    return val;
}

function buildButtonCell(row) {
    let cell = row.append('td').attr('class', 'button');

    buildButton(cell, 'Edit', toggle_rows);
    buildButton(cell, 'Delete', deleteRow);
    buildButton(cell, 'Add', addRow);
}

function buildButton(cell, text, callback) {
    cell.append('button')
        .attr('type', 'button')
        .attr('class', text.toLowerCase())
        .attr('row_index', (d, i) => i)
        .text(text)
        .on('click', callback);
}


function redrawGraph(){
    const { rerender_button } = getPageElements();
    rerender_button.node().click();
}
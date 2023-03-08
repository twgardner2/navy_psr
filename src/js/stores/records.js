import * as d3 from 'd3';

import { updateRecord, removeRecord, clearRecords } from './slices/record-slice'; 
import { appStore } from './app-state';

import { DataProvider } from '../data/providers/DataProvider';
import { clear_psr_viz, draw_psr_viz } from '../view/graph/graph';
import { populate_table } from '../view/table/table';
import { scrubNames } from '../view/record-selector';


export function updateNewRecord(recordName, parsedData){
    appStore.dispatch(updateRecord({
        recordName: recordName,
        parsedData: parsedData
    }));
}

export function removeRecordByName(recordName){
    appStore.dispatch( removeRecord({
        recordName: recordName
    }));
}

export function removeAllRecords(){
    appStore.dispatch( clearRecords() );
}


export function getAllRecordNames(){
    return Object.keys(appStore.getState().records);
}

export function nameToId(name){
    return name.replace(/ /g, '-')
}

appStore.subscribe( () => {
    //Setup names in top portion
    let names=getAllRecordNames()

    scrubNames(names);

    if(names.length === 1){
        d3.select('.delete-btn').remove()
    }

    //Redraw the Graph
        clear_psr_viz(document.getElementById('canvas'));
        
        draw_psr_viz();

        const table=d3.select('.table')


        //Redraw the Tables
        if(appStore.getState().view.viewMode === 'single'){

            table.style('display', 'block');
            populate_table();

        } else{ 
            table.style('display', 'none')

        }

});
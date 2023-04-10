import * as d3 from 'd3';

import { updateRecord, removeRecord, clearRecords } from './slices/record-slice'; 
import { appStore } from './app-state';

import { DataProvider } from '../data/providers/DataProvider';
import { clear_psr_viz, draw_psr_viz } from '../view/graph/graph';
import { populate_table } from '../view/table/table';
import { scrubNames } from '../view/record-selector';
import { isMultiView, setSingleViewMode } from './view-settings';
import { setActiveRecord } from './slices/view-slice';
import { sample_name } from '../lib';


export function updateNewRecord(recordName, parsedData){
    appStore.dispatch(updateRecord({
        recordName: recordName,
        parsedData: parsedData
    }));
}

export function getActiveRecordName() {
    let state = appStore.getState();
    let names = getAllRecordNames();
    if (typeof state.view.activeRecord === 'string') {
        return state.view.activeRecord;
    } else if (names.length){
        return names[0]
    } else {
        return sample_name
    }
}

export function getActiveRecord() {
    let state = appStore.getState();
    let name = getActiveRecordName();
    return state.records[name];
}


export function removeRecordByName(recordName){
    if(getActiveRecordName() === recordName){
        const names=getAllRecordNames()
        appStore.dispatch(setActiveRecord({
            activeRecord: names[0]
        }))
    }

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
    let names=getAllRecordNames();

    scrubNames(names);

    if(names.length === 1){
        d3.select('.delete-btn').remove();
        d3.select('#view_toggle').style('display', 'none');
        
        if(isMultiView()){
            setSingleViewMode();
        }
    } else {
        d3.select('#view_toggle').style('display', 'block');
    }

    //Redraw the Graph
        clear_psr_viz(document.getElementById('canvas'));
        
        draw_psr_viz();

        //Redraw the Tables
        if(appStore.getState().view.viewMode === 'single'){
            document.body.classList.remove('multiview');
            document.getElementById( getActiveRecordName() ).classList.add('active');
            
            if(appStore.getState().view.tableLock){
                populate_table();
            }
        } else{ 
            document.body.classList.add('multiview');
        }

});
import { deserify } from '@karmaniverous/serify-deserify';
import * as d3 from 'd3';

import { appStore } from './app-state';
import { addHiddenRecord, lockTable, setActiveRecord, setComparisonMode, setMeasureModeGroup, setMeasureModeRSCA, setViewMode, showAllRecords, showHiddenRecord, updateFlatPickr } from  './slices/view-slice';


export function showSingleRecord(id){
    appStore.dispatch( 
        setActiveRecord({
            activeRecord: id
        })
    );
}

export function setMulitView(){
    appStore.dispatch( lockTable());

    appStore.dispatch(setViewMode({
        viewMode: 'multiple'
    }));

}

export function setFlatPickr(date){
    appStore.dispatch( updateFlatPickr({
        date: date
    }));
}

export function getFlatPickr(){
    return deserify(appStore.getState().view.flatPickr)
}

export function setSingleViewMode(){
    appStore.dispatch(showAllRecords());
    
    appStore.dispatch(setViewMode({
        viewMode:'single'
    }));
}

export function setComparisonType(type){
    appStore.dispatch(setComparisonMode({
        comparisonMode: type
    }));
}

export function isMultiView(){
    return appStore.getState().view.viewMode === 'multiple';
}

export function isHiddenId(id){
    const {hiddenRecords} = appStore.getState().view;
    return hiddenRecords.indexOf(id) !== -1
}

export function multiHide(id){
    appStore.dispatch(addHiddenRecord({
        hiddenRecord: id
    }));
}

export function multiShow(id){
    appStore.dispatch(showHiddenRecord({
        hiddenRecord:id
    }));
}

export function bindToTabs(){
    d3.selectAll('.tab button').on('click', function(e){
        d3.selectAll('.tablinks').attr('class', 'tablinks');
        this.classList.add('active');

        const action= e.target.dataset.view === 'sum_group-comp' ? setMeasureModeGroup() : setMeasureModeRSCA();

        appStore.dispatch(action);
    });
}

export function getMeasureMode(){
    return appStore.getState().view.measureMode
}
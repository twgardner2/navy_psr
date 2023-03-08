import * as d3 from 'd3';

import { appStore } from './app-state';
import { addHiddenRecord, setActiveRecord, setComparisonMode, setViewMode, showHiddenRecord } from  './slices/view-slice';


export function showSingleRecord(id){
    appStore.dispatch( 
        setActiveRecord({
            activeRecord: id
        })
    );
}

export function setMulitView(){
    appStore.dispatch(setViewMode({
        viewMode: 'multiple'
    }));

}

export function setSingleViewMode(){
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
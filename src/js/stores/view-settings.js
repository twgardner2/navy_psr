
import { appStore } from './app-state';
import { setActiveRecord, setViewMode } from  './slices/view-slice';


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
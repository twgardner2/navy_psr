
import { appStore } from './app-state';
import { setActiveRecord } from  './slices/view-slice';


export function showSingleRecord(id){
    appStore.dispatch( 
        setActiveRecord({
            activeRecord: id
        })
    );
}
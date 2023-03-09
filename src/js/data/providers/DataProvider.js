
import { getActiveRecord, getActiveRecordName} from '../../stores/records';
import { SingleDataProvider } from './SingleDataProvider';
import { MultiDataProvider } from './MultiDataProvider';
import { isMultiView } from '../../stores/view-settings';

export class DataProvider {
    constructor() {

        if(!isMultiView()){
            const rawPsr = getActiveRecord()
            const recordName=getActiveRecordName()

            this.provider= new SingleDataProvider(recordName, rawPsr);

            Array.from(document.getElementsByClassName('record-name')).map(e=>e.classList.remove('active'));
            let active=recordName;
            document.getElementById(active).classList.add('active');
        
        } else {
            this.provider=new MultiDataProvider();
        }
    }

    *[Symbol.iterator]() {
        if(isMultiView()){
            for(const id in this.provider.providers){
                yield [id, this.provider.providers[id]];
            }

        } else {
            yield [getActiveRecordName(), this.provider];
        }

    }


    /*
    * Getters for construction by composition. Probably a better way to do this, 
    *     but it does provide a useful "interface" specification of sorts
    */

    get time_scale(){
        return this.provider.time_scale;
    }

    get min_start_date(){
        return this.provider.min_start_date;
    }

    get updateActiveRecord(){
        return this.provider.updateActiveRecord;
    }

}


import { getState } from '../../stores/app-state';
import { getAllRecordNames, nameToId } from '../../stores/records';
import { SingleDataProvider } from './SingleDataProvider';
import { MultiDataProvider } from './MultiDataProvider';
import { isMultiView } from '../../stores/view-settings';

export class DataProvider {
    constructor() {

        if(!isMultiView()){
            const rawPsr = this.getActiveRecord();
            this.provider= new SingleDataProvider(rawPsr);

            Array.from(document.getElementsByClassName('record-name')).map(e=>e.classList.remove('active'));
            let active=nameToId(this.getActiveRecordName());
            document.getElementById(active).classList.add('active');
        
        } else {
            this.provider=new MultiDataProvider();
        }
    }

    getActiveRecordName() {
        let state = getState();
        let names = getAllRecordNames();
        if (typeof state.view.activeRecord === 'string') {
            return state.view.activeRecord;
        } else if (names.length){
            return names[0]
        } else {
            return 'Sample';
        }
    }

    getActiveRecord() {
        let state = getState();
        let name = this.getActiveRecordName();
        return state.records[name];
    }

    *[Symbol.iterator]() {
        if(isMultiView()){
            for(const id in this.provider.providers){
                yield [id, this.provider.providers[id]];
            }

        } else {
            yield [this.getActiveRecordName(), this.provider];
        }

    }


    /*
    * Getters for construction by composition. Probably a better way to do this, 
    *     but it does provide a useful "interface" specification of sorts
    */

    get time_scale(){
        return this.provider.time_scale;
    }

    get get_paygrade_dates(){
        return this.provider.get_paygrade_dates;
    }

    get get_station_dates(){
        return this.provider.get_station_dates;
    }

    get get_rs_name_dates(){
        return this.provider.get_rs_name_dates;
    }

    get min_start_date(){
        return this.provider.min_start_date;
    }

    get psr(){
        return this.provider.psr
    }

    get fitrepsGroupedByPaygradeAndRepsen(){
        return this.provider.fitrepsGroupedByPaygradeAndRepsen;
    }

    get fitrepsSameRsNewRank(){
        return this.provider.fitrepsSameRsNewRank;
    }

    get fitrepGaps(){
        return this.provider.fitrepGaps
    }

    get updateActiveRecord(){
        return this.provider.updateActiveRecord;
    }

}

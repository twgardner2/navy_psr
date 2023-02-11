import { updateNewRecord } from "../../stores/records";
import { setActiveRecord } from "../../stores/slices/view-slice";
import { appStore } from "../../stores/app-state";

const { fields } = require('../schema');



export class DataLoader {
    constructor(data) {
        this.psr=this.format(data);
        this.validatePsr();
    }
    
    setRecordName(recordName) {
        this.recordName=recordName;
    }

    load(){
        if(typeof this.recordName === 'undefined'){
            throw 'DataLoader requires a record name before loading';
        }

        updateNewRecord(this.recordName, this.psr);
        
        appStore.dispatch(setActiveRecord({
            activeRecord : this.recordName
        })
        );
    }

    format(data) {
        return data.map((entry) => {
            let type;
            for (let k in entry) {
                if (!fields[k] || !fields[k].type) {
                    continue;
                }
                type = fields[k].type;
                if (type === 'number' || type === 'average') {
                    entry[k] = Number(entry[k]);
                } else if (type === 'date' && !(entry[k] instanceof Date)) {
                    entry[k] = new Date(entry[k]);
                } else if (type === 'text') {
                    entry[k] = entry[k].toString().trim();
                }
            }
            return entry;
        });
    }

    validatePsr() {
        this.psr.forEach((entry) => {
            Object.keys(fields).forEach((key) => {
                if(key === 'sum_group'){
                    return;
                }
                
                if (
                    typeof entry[key] === 'undefined' &&
                    !fields[key]['optional']
                ) {
                    throw `${key} undefined for entry in parsed data`;
                }
            });
        });
    }
}
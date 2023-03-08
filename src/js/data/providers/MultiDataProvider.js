
import { getState } from "../../stores/app-state";
import { isHiddenId } from "../../stores/view-settings";
import { AbstractProvider } from "./AbstractProvider";
import { SingleDataProvider } from "./SingleDataProvider";



export class MultiDataProvider extends AbstractProvider{

    constructor(){
        super();
        const state=getState();

        const hiddenRecords=state.view.hiddenRecords;
        this.comparisonMode=state.view.comparisonMode;

        const shownRecords=Object.keys(state.records).filter(id=>!isHiddenId(id));

        this.providers={};

        for(let id of shownRecords){
            this.providers[id]=new SingleDataProvider(this.parse(state.records[id]));
        }

        this.setDatesandTime();
    }

    getStartDate(){
        if(this.comparisonMode === 'time'){
            const currentDate = new Date();
            const newDate = new Date(currentDate.setFullYear(currentDate.getFullYear() - 5));
            newDate.setMonth(0);
            newDate.setDate(1);

            return newDate;

        } else if (this.comparisonMode === 'rank'){
            let mapped=[]

            for(const id in this.providers){
                mapped.push(this.providers[id].fitrepsGroupedByPaygrade());
            }

            const noToCompare=2;

            const grades=new Set(mapped.map(m=>Array.from(m.keys())).flat());
            const forComparison=Array.from(grades)
                .sort()
                .slice(-noToCompare);
            
            const startGrade=forComparison[0];

            let startDates=[];
            for(let records of mapped){
                records.get(startGrade).map(fitrep=>{
                    startDates.push(fitrep.start_date);
                });
            }

            const earliest=startDates.reduce((previousDate, currentDate) => {
                return currentDate < previousDate ? currentDate : previousDate;
              });

            return earliest;
        }
    }

    getEndDate(){
        let endDates=[];
        for(const id in this.providers){
            endDates.push(this.providers[id].endDate);
        }

        const latest=endDates.reduce((previousDate, currentDate) => {
            return currentDate > previousDate ? currentDate : previousDate;
          });

        return latest;
    }


}
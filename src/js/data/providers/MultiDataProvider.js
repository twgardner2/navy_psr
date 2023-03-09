
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
            this.providers[id]=new SingleDataProvider(id, this.parse(state.records[id]));
        }

        this.setDatesandTime();
    }

    getRanksForComparison(){
        let mapped=[]

            for(const id in this.providers){
                mapped.push(this.providers[id].fitrepsGroupedByPaygrade());
            }

            const noToCompare=2;

            const grades=new Set(mapped.map(m=>Array.from(m.keys())).flat());
            const forComparison=Array.from(grades)
                .sort()
                .slice(-noToCompare);

            return forComparison;
    }

    getComparisonStartGrade(){
        const ranks=this.getRanksForComparison();
        return ranks[0];
    }

    getStartDate(){
        if(this.comparisonMode === 'time'){
            const currentDate = new Date();
            const newDate = new Date(currentDate.setFullYear(currentDate.getFullYear() - 5));
            newDate.setMonth(0);
            newDate.setDate(1);

            return newDate;

        } else if (this.comparisonMode === 'rank'){
            
            const startGrade=this.getComparisonStartGrade();

            let startDates=[];
            for(const id in this.providers){
                startDates.push(this.providers[id].getStartDateForPaygrade(startGrade));
            }

            return this.getEarliestDate(startDates);
            
        }
    }

    getEndDate(){
        let endDates=[];
        for(const id in this.providers){
            endDates.push(this.providers[id].endDate);
        }

        return this.getLatestDate(endDates);
    }


}
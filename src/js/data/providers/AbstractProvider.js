import * as lib from '../../lib';
import * as d3 from 'd3';
import { deserify } from "@karmaniverous/serify-deserify";


export class AbstractProvider{

    setDatesandTime(){
        this.startDate = this.getStartDate();
        this.endDate = this.getEndDate();
        this.setTimeScale();
    }

    setTimeScale() {

        this.time_scale = d3
            .scaleTime()
            .domain([this.startDate, this.endDate])
            .range([
                0,
                lib.canvas_width -
                    lib.y_axis_width -
                    lib.margin.left -
                    lib.margin.right,
            ]);
    }

    parse(psr){
        return deserify(psr)
    }

    getEarliestDate(dates){
        
        const earliest=dates.reduce((previousDate, currentDate) => {
            return currentDate < previousDate ? currentDate : previousDate;
          });

        return earliest;
    }

    getLatestDate(dates){
        const latest=dates.reduce((previousDate, currentDate) => {
            return currentDate > previousDate ? currentDate : previousDate;
          });

        return latest;
    }
}
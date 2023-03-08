import * as lib from '../../lib';
import * as d3 from 'd3';
import { deserify } from "@karmaniverous/serify-deserify";


export class AbstractProvider{

    construct(){
        
    }

    setDatesandTime(){
        this.startDate = this.getStartDate();
        this.endDate = this.getEndDate();
        this.setTimeScale();
    }

    setTimeScale() {
        this.min_start_date = this.startDate;
        this.max_end_date = this.endDate;

        this.time_scale = d3
            .scaleTime()
            .domain([this.min_start_date, this.max_end_date])
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

}
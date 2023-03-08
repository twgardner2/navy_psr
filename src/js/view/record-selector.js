import * as d3 from 'd3';
import { isHiddenId, isMultiView, multiHide, multiShow, setComparisonType, setMulitView, setSingleViewMode, showSingleRecord } from '../stores/view-settings';
import { nameToId, removeRecordByName  } from '../stores/records';

export function appendMultiNameSelect(parent){
    parent
        .append('div')
        .attr('id', 'record-names')
}

export function scrubNames(names){
    d3.select('#record-names')
        .selectAll('.record-name')
        .data(names)
        .join(
            function(enter){
                return enter
                .append('div')
                .attr('id', (d)=>nameToId(d) )
                .attr('data-individual', (d)=>nameToId(d))
                .attr('class', (d)=>{
                    let cssClass='record-name'
                    const id=nameToId(d);
                    if(isHiddenId(id)){
                        cssClass += ' multi-hidden';
                    }
                    return cssClass;
                })
                .on('click', (e)=>{
                    let name=e.target.id;
                    
                    if(!isMultiView()){
                        e.target.classList.add('active');
                        showSingleRecord(name);
                    } else {
                        if(e.target.classList.contains('multi-hidden')){
                            multiShow(name);
                            e.target.classList.remove('multi-hidden');
                        } else {
                            multiHide(name);
                            e.target.classList.add('multi-hidden');
                        }
                    }
                })
                .html(d=>d)
                .call( parent =>{
                    parent.append('div')
                    .attr('class', 'delete-btn')
                    .attr('data-name', d=>d)
                    .on('click', (e)=>{
                        e.stopPropagation()
                        let name=e.target.dataset.name;
                        removeRecordByName(name);
                        let id=nameToId(name);
                        d3.select(`#${id}`).remove();
                    })
                    .html("X")
                })
            },
            function(update){
                return update
                    .attr('id', (d)=>nameToId(d) )
                    .html(d=>d)
                    .call( parent =>{
                        parent.append('div')
                        .attr('class', 'delete-btn')
                        .attr('data-name', d=>d)
                        .on('click', (e)=>{
                            e.stopPropagation()
                            let name=e.target.dataset.name;
                            removeRecordByName(name);
                            let id=nameToId(name);
                            d3.select(`#${id}`).remove();
                        })
                        .html("X")
                    })
            },
            function(exit){
                exit.remove(); 
            }
        );
}


export function bindToViewToggle(){
    d3.select('#view_toggle input')
        .on('change', (e)=>{
            let multi= e.target.checked;
            if(multi){
                setMulitView();
            } else {
                setSingleViewMode();
            }
        });

    d3.select('#compare_toggle input')
        .on('change', (e)=>{
            let compare= e.target.checked ? 'time' : 'rank';
            setComparisonType(compare);
        })
}
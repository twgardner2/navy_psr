import * as d3 from 'd3';
import { isHiddenId, isMultiView, multiHide, multiShow, setComparisonType, setMulitView, setSingleViewMode, showSingleRecord } from '../stores/view-settings';
import { nameToId, removeRecordByName  } from '../stores/records';
import { revertIndvidualDetails, showIndivdualDetails } from './graph/graph';

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
                .on('mouseover', (e)=>{
                    if(!isMultiView()){
                        return;
                    }
                    const ind=e.target.dataset.individual;
                    showIndivdualDetails(ind)
                })
                .on('mouseleave', (e)=>{
                    if(!isMultiView){
                        return;
                    }
                    const ind=e.target.dataset.individual;                    
                    revertIndvidualDetails(ind);
                })
                .html(d=>d)
                .call(chickletChildren)
            },
            function(update){
                return update
                    .attr('id', (d)=>nameToId(d) )
                    .attr('data-individual', (d)=>nameToId(d))
                    .html(d=>d)
                    .call(chickletChildren)
            },
            function(exit){
                exit.remove(); 
            }
        );
    
    d3.selectAll('input.multi-record-toggle')
            .each( function(){
                const checkbox = d3.select(this);
                const name = checkbox.attr('data-name');
                checkbox.property('checked', !isHiddenId(nameToId(name)));
            });
}

function chickletChildren(parent){
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

    parent.append('input')
        .attr('class', 'multi-record-toggle')
        .attr('type', 'checkbox')
        .attr('data-name', d=>d);
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
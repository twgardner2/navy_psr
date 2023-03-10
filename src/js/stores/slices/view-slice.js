import { serify } from '@karmaniverous/serify-deserify';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    activeRecord: false,
    measureMode: 'rsca',
    viewMode: 'single',
    comparisonMode: 'rank',
    tableLock: true,
    hiddenRecords: [],
    flatPickr: serify(new Date(0))
};

const viewSlice = createSlice({
    name: 'view',
    initialState,
    reducers: {
        setActiveRecord: (state, action) => {
            const { activeRecord } = action.payload;
            state.activeRecord = activeRecord;
        },
        clearActiveRecord: (state, action) => {
            state.activeRecord = false;
        },
        setViewMode: (state, action) => {
            const { viewMode } = action.payload;
            state.viewMode = viewMode;
        },
        setComparisonMode: (state, action) => {
            const { comparisonMode } = action.payload;
            state.comparisonMode = comparisonMode;
        },
        setMeasureModeRSCA: (state)=>{
            state.measureMode='rsca'
        },
        setMeasureModeGroup: (state)=>{
            state.measureMode='group'
        },
        addHiddenRecord: (state, action) => {
            const { hiddenRecord } = action.payload;
            let current=new Set(state.hiddenRecords);
            current.add(hiddenRecord);
            state.hiddenRecords=Array.from(current)
        },
        showHiddenRecord: (state, action) => {
            const { hiddenRecord } = action.payload;
            let current=new Set(state.hiddenRecords);
            current.delete(hiddenRecord);
            state.hiddenRecords=Array.from(current);
        },
        showAllRecords: (state) => {
            state.hiddenRecords = [];
        },
        lockTable: (state)=>{
            state.tableLock=true
        },
        openTable: (state)=>{
            state.tableLock=false;
        },
        updateFlatPickr: (state, action)=>{
            const {date} = action.payload
            state.flatPickr=date;
        }
    },
});

export const {
    setActiveRecord,
    clearActiveRecord,
    setViewMode,
    setComparisonMode,
    addHiddenRecord,
    showHiddenRecord,
    showAllRecords,
    setMeasureModeGroup,
    setMeasureModeRSCA,
    lockTable,
    openTable,
    updateFlatPickr
} = viewSlice.actions;

export default viewSlice.reducer;

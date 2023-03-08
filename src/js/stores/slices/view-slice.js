import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    activeRecord: false,
    viewMode: 'single',
    comparisonMode: 'rank',
    hiddenRecords: [],
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
} = viewSlice.actions;

export default viewSlice.reducer;

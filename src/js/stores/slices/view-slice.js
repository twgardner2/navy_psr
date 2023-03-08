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
            if (state.hiddenRecords.indexOf(hiddenRecord) !== -1) {
                state.hiddenRecords.push(hiddenRecord);
            } else {
                console.log(`Error: ${hiddenRecord} already hidden`);
            }
        },
        showHiddenRecord: (state, action) => {
            const { hiddenRecord } = action.payload;
            const index = state.hiddenRecords.indexOf(hiddenRecord);
            if (index !== -1) {
                state.hiddenRecords = state.hiddenRecords.filter(
                    (v, i) => i !== index
                );
            } else {
                console.log(`Error: ${hiddenRecord} is not hidden`);
            }
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

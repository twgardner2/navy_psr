import { createSlice } from '@reduxjs/toolkit';

const initialState= {};

const recordSlice=createSlice({
    'name': 'records',
    initialState,
    reducers:{
        updateRecord: (state, action) => {
            const {recordName, parsedData} = action.payload

            state[recordName] = parsedData;
        },
        removeRecord: (state, action) => {
            const { recordName } = action.payload
            delete state[recordName];
        },
        clearRecords: (state) => {
            state={};
        }
    }
});

export const { updateRecord , removeRecord, clearRecords } = recordSlice.actions;

export default recordSlice.reducer;
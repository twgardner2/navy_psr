import { configureStore } from '@reduxjs/toolkit';
import { createReduxMiddleware} from '@karmaniverous/serify-deserify';

import recordReducer from './slices/record-slice';
import viewReducer from './slices/view-slice';

const serifyMiddleware=createReduxMiddleware();


export const appStore = configureStore({
    reducer: {
        records: recordReducer,
        view: viewReducer,
    },
    middleware: (getDefaultMiddleware) => [
        ...getDefaultMiddleware(),
        // Add the serify middleware last, or Redux Toolkit's serializableCheck
        // will reject values before they are serified!
        serifyMiddleware,
      ],
});


export function getState(){
    return appStore.getState();
}
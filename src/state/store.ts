import {configureStore} from '@reduxjs/toolkit';

import animeReducer from './anime/animeSlice';

const store = configureStore({
    reducer:animeReducer
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store;
import {configureStore,combineReducers} from '@reduxjs/toolkit';

import animeReducer from './anime/animeSlice';

const rootReducer = combineReducers({
  anime: animeReducer
})

export function setupStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer:rootReducer,
    preloadedState
})
}

const store = setupStore();

export type RootState = ReturnType<typeof rootReducer>
// export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = ReturnType<typeof setupStore>
export default store;
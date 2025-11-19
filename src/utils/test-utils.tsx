import React, {type PropsWithChildren } from 'react'
import { render } from '@testing-library/react'
import {userEvent} from '@testing-library/user-event';
import type { RenderOptions } from '@testing-library/react'
// import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import {BrowserRouter} from 'react-router-dom';

import type { AppStore, RootState } from '../state/store'
import { setupStore } from '../state/store'
// As a basic setup, import your same slice reducers
// import animeReducer from '../state/anime/animeSlice'

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<RootState>
  store?: AppStore
}

// export function renderWithProviders(
//   ui: React.ReactElement,
//   extendedRenderOptions: ExtendedRenderOptions = {}
// ) {
//   const {
//     preloadedState = {},
//     // Automatically create a store instance if no store was passed in
//     store = setupStore(preloadedState),
//     ...renderOptions
//   } = extendedRenderOptions

//   const Wrapper = ({ children }: PropsWithChildren) => (
//     <Provider store={store}>{children}</Provider>
//   )

//   // Return an object with the store and all of RTL's query functions
//   return {
//     store,
//     ...render(ui, { wrapper: Wrapper, ...renderOptions })
//   }
// }

export const renderWithProviderAndRouter = (ui:React.ReactNode,
  extendedRenderOptions: ExtendedRenderOptions = {}, {route = '/'} = {}) => {
    const {
        preloadedState = {},
        // Automatically create a store instance if no store was passed in
        store = setupStore(preloadedState),
        ...renderOptions
    } = extendedRenderOptions

    const Wrapper = ({ children }: PropsWithChildren) => (
        <Provider store={store}><BrowserRouter>{children}</BrowserRouter></Provider>
    )
  
    window.history.pushState({}, 'Test page', route)

    return {
        user: userEvent.setup(),
        ...render(ui, {wrapper: Wrapper, ...renderOptions}),
    }
}
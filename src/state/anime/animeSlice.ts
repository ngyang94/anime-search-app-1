import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';

import {type animeListType, type paginationType} from '../../lib/sharedTypes';

const initialState:{
    value:{
        animeList:animeListType,
        pagination:paginationType
    }
} = {
    value:{
        animeList:[],
        pagination:null
    }
}

const animeSlice = createSlice({
    name:"anime",
    initialState,
    reducers:{

    },
    extraReducers:(builder)=>{
        builder.addCase(getAnimeList.fulfilled,(state,action)=>{
            state.value.animeList = action.payload.data;
            state.value.pagination = action.payload.pagination;
        })
    }
})

export const getAnimeList = createAsyncThunk(
    "anime/getAnimeList",
    async({animeName,abortController,page=1,limit=24}:{animeName:string,abortController:AbortController,page?:number,limit?:number})=>{
        
        const response = await fetch(
            `https://api.jikan.moe/v4/anime?q=${animeName}&limit=${limit}&page=${page}`,
            {
                signal:abortController.signal
            }
        );
        
        if(!response.ok){
            return {data:[],pagination:{}};
        }
        const result = await response.json();
        
        return result;
    }
);
// export const [] = animeSlice.actions;

export default animeSlice.reducer;
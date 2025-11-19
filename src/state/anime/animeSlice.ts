import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';

import type { animeListType, paginationType, apiStatus} from '../../models/anime';

const initialState:{
    animeList:animeListType,
    pagination:paginationType,
    apiStatus:apiStatus
} = {
    animeList:[],
    pagination:null,
    apiStatus:null
}

const animeSlice = createSlice({
    name:"anime",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(
            getAnimeList.fulfilled,
            (state,action)=>{
                state.animeList = action.payload.data;
                state.pagination = action.payload.pagination;
                state.apiStatus = action.payload.apiStatus;
            }
        ).addCase(
            getAnimeList.rejected,
            (state,action)=>{
                
                state.animeList = [];
                state.pagination = null;
                state.apiStatus = {
                    status: "Error",
                    statusText: action.error.message?.toString()||"",
                    message: action.error.message?.toString()||""
                };

            }
        )
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

            if(abortController.signal.aborted){
                throw new Error(
                    "499 Client Closed Request"
                    // ,
                    // {
                    //     cause:{
                    //         status:499,
                    //         statusText:"Client Closed Request",
                    //         message:"499 Client Closed Request"
                    //     }
                    // }
                );
            }else{
                throw new Error(
                    `API return status : ${response.status} ${response.statusText}`
                    // ,
                    // {
                    //     cause:{
                    //         status:response.status,
                    //         statusText:response.statusText,
                    //         message:`${response.status} ${response.statusText}`
                    //     }
                    // }
                )
            };

        }

        const result = await response.json();

        const apiStatus:apiStatus = {
            status:200,
            statusText:"",
            message:""
        }
        return {...result,...apiStatus};
    }
);
// export const [] = animeSlice.actions;

export default animeSlice.reducer;
import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';

import {type animeListType, type paginationType} from '../../lib/sharedTypes';

const initialState:{
    animeList:animeListType,
        pagination:paginationType
} = {
    animeList:[],
    pagination:null
}

const animeSlice = createSlice({
    name:"anime",
    initialState,
    reducers:{

    },
    extraReducers:(builder)=>{
        builder.addCase(getAnimeList.fulfilled,(state,action)=>{
            state.animeList = action.payload.data;
            state.pagination = action.payload.pagination;
            console.log(action.payload.pagination);
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

        // return {
        //     data:[
        //         {
        //             images:{
        //                 jpg:{
        //                     image_url:"./test-image.jpg"
        //                 }
        //             },
        //             title:"this is a test title",
        //             title_japanese:"this is a test japanense title",
        //             score:5.0,
        //             popularity:10,
        //             synopsis:"this is a test synopsis"
        //         }
        //     ],
        //     pagination:{
        //         current_page:1,
        //         has_next_page:true,
        //         items:{
        //             count:24,
        //             per_page:24,
        //             total:48,
        //         },
        //         last_visible_page:2
        //     }
        // };
        
        return result;
    }
);
// export const [] = animeSlice.actions;

export default animeSlice.reducer;
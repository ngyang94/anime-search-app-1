import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';

type animeListType = [
    {
        images:{
            jpg:{
                image_url:string,
                large_image_url:string,
                small_image_url:string
            }
        },
        title:string,
        title_japanese:string,
        score:string,
        popularity:string,
        synopsis:string
    }
]|[];

const initialState:{
    value:{
        animeList:animeListType,
        pagination:{}
    }
} = {
    value:{
        animeList:[],
        pagination:{}
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
    async({animeName,abortController,limit=24,page=1}:{animeName:string,abortController:AbortController,limit?:number,page?:number})=>{
        
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
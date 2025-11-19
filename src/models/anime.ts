
export type animeListType = [
    {
        images:{
            jpg:{
                image_url:string
            }
        },
        title:string,
        title_japanese:string,
        score:string,
        popularity:string,
        synopsis:string
    }
]|[];

export type paginationType = {
    current_page:number;
    has_next_page:boolean;
    items:{
        count:number;
        per_page:number;
        total:number;
    },
    last_visible_page:number;
}|null;

export type apiStatus = {
    status:string|number;
    statusText:string;
    message:string;
}|null;

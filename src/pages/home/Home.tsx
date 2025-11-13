import {useEffect,useState, type ChangeEvent} from 'react';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from "@/components/ui/input-group";
import { Search } from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {useSelector,useDispatch} from 'react-redux';
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {useNavigate} from 'react-router-dom';
import { Spinner } from "@/components/ui/spinner";

import {type RootState,type AppDispatch} from '../../state/store';
import {getAnimeList} from '../../state/anime/animeSlice';
import './Home.css';
import { debounce } from '@/utils/optimization';
import PaginationV2 from '../../components/custom/PaginationV2';
import Header from '../../components/custom/Header';

let abortController = new AbortController();

export default function Home(){

    let skeletonAmountToRender: number[] = [];
    const amountSkeletonTobeRender = 20;
    for(let i:number=0;i<amountSkeletonTobeRender;i++){
        skeletonAmountToRender.push(i);
    }

    const animeList = useSelector((state:RootState)=>state.value.animeList);
    const pagination = useSelector((state:RootState)=>state.value.pagination);
    const dispatch = useDispatch<AppDispatch>();
    const [animeInput,setAnimeInput] = useState(()=>{
        return localStorage.getItem("animeInput")||"";
    });
    const navigate = useNavigate();
    const [isLoading,setIsLoading] = useState(false);

    const searchAnimeList = debounce(async(args)=>{
        
        setIsLoading(true);
        await dispatch(getAnimeList({animeName:args||"",abortController:abortController}));
        setIsLoading(false);

    },1500);

    const gotoPage = async(page:number)=>{

        if(!abortController.signal.aborted){
            abortController.abort();
            abortController = new AbortController();
        }
        setIsLoading(true);
        await dispatch(getAnimeList({animeName:animeInput,abortController:abortController,page}));
        setIsLoading(false);

    };

    function animeInputHandler(event:ChangeEvent<HTMLInputElement>){

        setAnimeInput(event.target.value);
        localStorage.setItem("animeInput",event.target.value);

        if(!abortController.signal.aborted){
            abortController.abort();
            abortController = new AbortController();
        }
        searchAnimeList(event.target?.value.trim());
    }

    function gotoAnimeDetailsPage(anime:any){
        navigate("/anime-details",{state:anime});
    }

    async function headerClickedHandler(){
        setAnimeInput("");
        localStorage.setItem("animeInput","");
        if(!abortController.signal.aborted){
            abortController.abort();
            abortController = new AbortController();
        }
        setIsLoading(true);
        await dispatch(getAnimeList({animeName:"",abortController:abortController}));
        setIsLoading(false);
    }

    useEffect(()=>{
        if(animeList.length==0&&localStorage.getItem("animeInput")==""){
            // dispatch(getAnimeList({animeName:"",abortController:abortController}));
            searchAnimeList("");
        }
    },[]);

    useEffect(()=>{
        console.log(isLoading);
    },[isLoading]);
    
    return (
        <>
            <Header onClick={headerClickedHandler}/>
            <main className="bg-white pb-1">
                <div className="px-10">
                    <InputGroup>
                        <InputGroupInput placeholder="Search" value={animeInput} onChange={(e)=>{animeInputHandler(e);}}/>
                        <InputGroupAddon>
                        {
                            isLoading?<Spinner />:<Search />
                        }
                        </InputGroupAddon>
                    </InputGroup>
                </div>
                <div className="m-5 p-5 grid grid-cols-3 gap-5 items-stretch">
                    {
                        animeList.length==0&&skeletonAmountToRender.map((skeleton)=>{
                            return (
                                <Card className="px-2 py-2 h-full" key={skeleton}>
                                    <CardContent className="p-0">
                                        
                                        <div className="grid grid-cols-4 gap-1">
                                            <Skeleton className="w-20 h-[150px] self-center col-span-1" />
                                            <div className="px-2 col-span-3 gap-2 flex flex-col space-y-1">
                                                <Skeleton className="text-1xl h-5 w-[210px]"/>
                                                <Skeleton className="h-5 w-[210px]"/>
                                                <Skeleton className="h-5 w-[210px]"/>
                                                <Skeleton className="h-5 w-[210px]"/>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    }
                    {
                        animeList.map((anime,index)=>{
                            return (
                                <Tooltip delayDuration={500} key={index}>
                                    <TooltipTrigger>
                                        <Card className="px-2 py-2 group hover:bg-yellow-50 h-full" onClick={()=>{gotoAnimeDetailsPage(anime);}}>
                                            <CardContent className="p-0 flex flex-col h-full m-0">
                                                <div className="grid grid-cols-4 gap-1">
                                                    <div className="w-1xl h-1xl bg-black overflow-hidden self-baseline col-span-1">
                                                        <img className="h-full object-fit" src={anime.images.jpg.image_url}/>
                                                    </div>
                                                    <div className="px-2 col-span-3 text-left block">
                                                        <p className="text-1xl font-bold pb-2">{anime.title}</p>
                                                        <p className="font-bold pb-2">{anime.title_japanese}</p>
                                                        <p>Score: {anime.score}</p>
                                                        <p>Popularity: {anime.popularity}</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <div className="w-100 text-1xl">
                                            {anime.synopsis}
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            );
                        })
                    }
                    
                </div>
                
                <PaginationV2 pagination={pagination} goToPage={gotoPage} maxPaginationAmountShow={5}/>

            </main>
        </>
    );
}
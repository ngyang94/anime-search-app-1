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
    const [animeInput,setAnimeInput] = useState("");
    const navigate = useNavigate();

    const searchAnimeList = debounce((args)=>{
        
        dispatch(getAnimeList({animeName:args[0]||"",abortController:abortController}));

    },1500);

    const gotoPage = (page:number)=>{

        if(!abortController.signal.aborted){
            abortController.abort();
            abortController = new AbortController();
        }
        dispatch(getAnimeList({animeName:animeInput,abortController:abortController,page}));

    };

    function animeInputHandler(event:ChangeEvent<HTMLInputElement>){
        setAnimeInput(event.target.value);
        if(!abortController.signal.aborted){
            abortController.abort();
            abortController = new AbortController();
        }
        searchAnimeList(event.target?.value.trim());
    }

    function gotoAnimeDetailsPage(anime:any){
        navigate("/anime-details",{state:anime});
    }
    useEffect(()=>{
        dispatch(getAnimeList({animeName:"",abortController:abortController}));
    },[]);

    // useEffect(()=>{
    //     console.log(animeList);
    //     console.log(pagination);
    // },[animeList]);
    
    return (
        <>
            <Header/>
            <main className="bg-white pb-1">
                <div className="px-10">
                    <InputGroup>
                        <InputGroupInput placeholder="Search..." value={animeInput} onChange={(e)=>{animeInputHandler(e);}}/>
                        <InputGroupAddon>
                        <Search />
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
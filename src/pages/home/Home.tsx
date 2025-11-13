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

import {type RootState,type AppDispatch} from '../../state/store';
import {getAnimeList} from '../../state/anime/animeSlice';
import './Home.css';
import { debounce } from '@/utils/optimization';

let abortController = new AbortController();

export default function Home(){

    let skeletonAmountToRender: number[] = [];
    const amountSkeletonTobeRender = 20;
    for(let i:number=0;i<amountSkeletonTobeRender;i++){
        skeletonAmountToRender.push(i);
    }

    const animeList = useSelector((state:RootState)=>state.value.animeList);
    const dispatch = useDispatch<AppDispatch>();
    const [animeInput,setAnimeInput] = useState("");

    const searchAnimeList = debounce((args)=>{
        
        dispatch(getAnimeList({animeName:args[0]||"",abortController:abortController}));

    },1500);

    function animeInputHandler(event:ChangeEvent<HTMLInputElement>){
        setAnimeInput(event.target.value);
        if(!abortController.signal.aborted){
            abortController.abort();
            abortController = new AbortController();
        }
        searchAnimeList(event.target?.value.trim());
    }
    useEffect(()=>{
        console.log("render home");
        dispatch(getAnimeList({animeName:"",abortController:abortController}));
    },[]);
    useEffect(()=>{
        console.log(animeList);
    },[animeList]);
    
    return (
        <>
            <header className="bg-white">
                <div>
                    <h1 className="text-5xl font-bold text-center p-10">Anime Search App</h1>
                </div>
            </header>
            <main className="bg-white">
                <div className="px-10">
                    <InputGroup>
                        <InputGroupInput placeholder="Search..." value={animeInput} onChange={(e)=>{animeInputHandler(e);}}/>
                        <InputGroupAddon>
                        <Search />
                        </InputGroupAddon>
                    </InputGroup>
                </div>
                <div className="m-5 p-5 grid grid-cols-3 gap-5">
                    {
                        animeList.length==0&&skeletonAmountToRender.map((skeleton)=>{
                            return (
                                <Card className="px-2 py-2" key={skeleton}>
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
                                <Card className="px-2 py-2 group hover:bg-yellow-50" key={index}>
                                    <CardContent className="p-0">
                                        <div className="grid grid-cols-4 gap-1">
                                            <div className="w-1xl h-1xl bg-black overflow-hidden self-center col-span-1">
                                                <img className="h-full object-fit" src={anime.images.jpg.image_url}/>
                                            </div>
                                            <div className="px-2 col-span-3">
                                                <p className="text-1xl font-bold mb-1">{anime.title}</p>
                                                <p className="font-bold mb-1">{anime.title_japanese}</p>
                                                <p>Score: {anime.score}</p>
                                                <p>Popularity: {anime.popularity}</p>
                                                {index>=12?(
                                                    <div className="transform -translate-y-full absolute invisible group-hover:visible bg-white p-2 rounded-1xl border-2 before:content-[''] before:block before:border-solid before:border-r-black before:border-r-4 before:border-y-transparent before:border-y-4 before:border-l-0  before:absolute before:transform before:bottom-0 before:-left-1">
                                                        {anime.synopsis}
                                                    </div>
                                                ):(
                                                    <div className="absolute invisible group-hover:visible bg-white p-2 rounded-1xl border-2 before:content-[''] before:block before:border-solid before:border-r-black before:border-r-4 before:border-y-transparent before:border-y-4 before:border-l-0  before:absolute before:transform before:-top-0.5 before:-left-1">
                                                        {anime.synopsis}
                                                    </div>
                                                )}
                                                
                                                
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    }
                    
                    
                </div>
            </main>
        </>
    );
}
import {useLocation} from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import Header from '../../components/custom/Header';
import {formatDate} from '../../utils/date';
import './AnimeDetails.css';

export default function AnimeDetails(){

    const location = useLocation();
    const animeDetails = location.state;
  
    return (
        <>
            <Header/>

            <main className="bg-white pb-1 px-10">
                <div className="grid grid-cols-7 gap-8 py-5">
                    <div className="col-span-2">
                        <div className="w-1xl h-1xl bg-black overflow-hidden">
                            <img className="object-fill h-full" src={animeDetails.images.jpg.image_url}/>
                        </div>
                    </div>
                    <div className="col-span-5">
                        <h3 className="text-2xl font-bold pb-3">{animeDetails.title}</h3>
                        <h4 className="font-semibold pb-4">{animeDetails.title_japanese}</h4>

                        <p><span className="font-semibold">Score:</span> {animeDetails.score}</p>
                        <p><span className="font-semibold">Popularity:</span> {animeDetails.popularity}</p>
                        <p><span className="font-semibold">Aired:</span> {formatDate(new Date(animeDetails.aired.from))} {animeDetails.aired.to?(<>to {formatDate(new Date(animeDetails.aired.to))}</>):(<></>)}</p>
                        <p><span className="font-semibold">Duration:</span> {animeDetails.duration}</p>
                        <p><span className="font-semibold">Episodes:</span> {animeDetails.episodes}</p>
                        <p><span className="font-semibold">Genres:</span> {animeDetails.genres.map((genre:{name:string},index:number)=>{return <Badge key={index} className="mr-2">{genre.name}</Badge>;})}</p>

                        <p><span className="font-semibold">Producers:</span> {animeDetails.producers.map((producer:{name:string},index:number)=>{return (index!=animeDetails.producers.length-1?<span key={index}>{producer.name}, </span>:<span key={index}>{producer.name}</span>);})}</p>
                        <p><span className="font-semibold">Status:</span> {animeDetails.status}</p>
                        <p><span className="font-semibold">Themes:</span> {animeDetails.themes.map((theme:{name:string},index:number)=>{return (index!=animeDetails.themes.length-1?<span key={index}>{theme.name}, </span>:<span key={index}>{theme.name}</span>);})}</p>
                        <p><span className="font-semibold">Status:</span> {animeDetails.status}</p>

                        <p className="pt-3 font-semibold">Synopsis</p>
                        <Separator/>
                        <p>{animeDetails.synopsis}</p>
                        
                    </div>
                    
                </div>
            </main>
        </>
    );
}
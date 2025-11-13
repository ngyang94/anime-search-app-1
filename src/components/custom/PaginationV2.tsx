import {useState, type FormEvent} from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"

import {type paginationType} from '../../lib/sharedTypes';
import './PaginationV2.css';

export default function PaginationV2({pagination,goToPage,maxPaginationAmountShow}:{pagination:paginationType,goToPage:(args:any)=>void,maxPaginationAmountShow:number}){

    const [inputPageNo,setInputPageNo] = useState<string>();
    const paginationNoToRender:number[] = [];
    const [popOverIsOpen,setPopOverIsOpen] = useState<boolean>(false);

    if(!!pagination&&pagination.current_page>Math.round(maxPaginationAmountShow/2)){
        
        if(pagination.current_page+Math.round(maxPaginationAmountShow/2)<=pagination.last_visible_page){
            
            for(let i=pagination.current_page-Math.round(maxPaginationAmountShow/2)+1;i<pagination.current_page+maxPaginationAmountShow-Math.round(maxPaginationAmountShow/2)+1;i++){
                paginationNoToRender.push(i);
            }
        }else{
            for(let i=pagination.last_visible_page-maxPaginationAmountShow+1;i<=pagination.last_visible_page;i++){
                paginationNoToRender.push(i);
            } 
        }

    }else if(!!pagination&&pagination.current_page<=Math.round(maxPaginationAmountShow/2)){
        if(pagination.last_visible_page>maxPaginationAmountShow){
            for(let i=1;i<=maxPaginationAmountShow;i++){
                paginationNoToRender.push(i);
            } 
        }else{
            for(let i=1;i<=pagination.last_visible_page;i++){
                paginationNoToRender.push(i);
            } 
        }
        
    }

    function inputPageNoHandler(event:FormEvent<HTMLInputElement>){
        if(pagination?.last_visible_page&&parseInt(event.currentTarget.value)>pagination?.last_visible_page){
            event.currentTarget.value=pagination?.last_visible_page.toString();
            setInputPageNo(pagination?.last_visible_page.toString());
        }else{
            setInputPageNo(event.currentTarget.value);
        }
    }

    function gotoPageNoButtonHandler(){
        if(!Number.isNaN(inputPageNo)){
            goToPage(inputPageNo);
            setPopOverIsOpen(false);
        }
        
    }
       
    return (
        <>
            <Pagination>
                <PaginationContent>

                    <PaginationItem>
                        {!!pagination&&pagination.current_page>1?(
                            <PaginationPrevious href="#" className="" onClick={(e)=>{e.preventDefault();goToPage((pagination.current_page-1))}}/>
                        ):(
                            <PaginationPrevious href="#" className="hover:bg-gray-10 hover:text-gray-10" onClick={(e)=>{e.preventDefault();}}/>
                        )}
                    </PaginationItem>

                    {
                        paginationNoToRender.map((paginationNo,index)=>{
                            return (
                                <PaginationItem key={index}>
                                    <PaginationLink href="#" isActive={!!pagination&&pagination.current_page==paginationNo} onClick={(e)=>{e.preventDefault();goToPage(paginationNo)}}>{paginationNo}</PaginationLink>
                                </PaginationItem>
                            );
                        })
                    }
                    
                    <Popover open={popOverIsOpen} onOpenChange={setPopOverIsOpen}>
                        <PopoverTrigger asChild>
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                        </PopoverTrigger>
                        <PopoverContent className="w-50">
                            <div className="flex gap-2">
                                <Input type="number" min={1} max={pagination?.last_visible_page} placeholder="Page No." className="w-30" onInput={(e)=>{inputPageNoHandler(e);}}/>
                                <Button variant="outline" onClick={gotoPageNoButtonHandler}>Go</Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                    
                    <PaginationItem>
                        {pagination?.has_next_page?(
                            <PaginationNext href="#" className="" onClick={(e)=>{e.preventDefault();goToPage((pagination.current_page+1))}}/>
                        ):(
                            <PaginationNext href="#" className="hover:bg-gray-10 hover:text-gray-10" onClick={(e)=>{e.preventDefault();}}/>
                        )}
                    </PaginationItem>

                </PaginationContent>
            </Pagination>
        </>
    );
}
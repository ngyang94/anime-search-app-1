import {useRef} from 'react';

export const debounce = (cb:(args:any)=>void,milSec:number)=>{
    let timerId = useRef<number|undefined>(undefined);

    return (args:any)=>{

        clearTimeout(timerId.current);

        timerId.current = setTimeout(()=>{
            cb(args);
        },milSec);

    }
}
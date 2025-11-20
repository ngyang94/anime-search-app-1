import {describe,it,expect,vi} from 'vitest';
import {waitFor} from '@testing-library/react';

import {debounce} from './optimization';

vi.mock("react",async()=>{
    const actual = vi.importActual("react");
    return {
        ...actual,
        useRef:()=>{
            return {current:null};
        }
    }
})
describe("debounce function",()=>{
    const mockedFunction = vi.fn();
    const debounceFunction =debounce(
        ()=>{
            mockedFunction();
        },
        1500
    )
    const mockedFunctionWithDebounce = vi.fn().mockImplementation(()=>{
        debounceFunction(); 
    })
    
    it(
        "it execute the mockedFunctionWithDebounce function once only after 1500 milliseconds after the mockedFunctionWithDebounce function stopped being called after 3 times in 1000 milliseconds interval'",
        async()=>{
            let intervalExeCounter = 0;
            let intervalid=setInterval(()=>{
                mockedFunctionWithDebounce();
                intervalExeCounter++;
                if(intervalExeCounter>3){
                    clearInterval(intervalid);
                }
            },1000)
            await waitFor(()=>{
                expect(mockedFunctionWithDebounce).toBeCalledTimes(3);
            },{timeout:3500});
            await waitFor(()=>{
                expect(mockedFunction).toBeCalledTimes(1);
            },{timeout:2500});
            
        }
    ,6000)
});
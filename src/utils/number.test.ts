import {describe,it,expect} from 'vitest';

import {addZeroPrefixToSingleNumber} from './number';

describe("addZeroPrefixToSingleNumber function",()=>{
    it("return 5 as '05'",()=>{
        expect(addZeroPrefixToSingleNumber(5)).toBe("05");
    })
    it("return 11 as '11'",()=>{
        expect(addZeroPrefixToSingleNumber(11)).toBe("11");
    })
});
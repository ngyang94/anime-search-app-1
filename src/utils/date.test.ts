import {describe,it,expect} from 'vitest';

import {formatDate} from './date';

describe("formatDate function",()=>{
    it("format the Date object with year 2025,month July, 9 as date to 09/07/2025",()=>{
        expect(formatDate(new Date(2025,6,9))).toBe("09/07/2025");
    })
    it("format the Date object with year 2025,month November, 25 as date to 25/11/2025",()=>{
        expect(formatDate(new Date(2025,10,25))).toBe("25/11/2025");
    })
});
import {describe,it,expect,afterEach,vi} from 'vitest';
import {screen,cleanup} from '@testing-library/react';

import {renderWithStub,renderWithProviderAndRouter} from './test-utils.tsx';

afterEach(()=>{
    cleanup();
});
describe("renderWithStub function",()=>{
    
    describe("render the component as page directly for testing use",()=>{
        
        const MockPage = vi.fn().mockImplementation(()=>{
            return <div>for testing use only</div>;
        })
        it("render the page with text 'for testing use only'",()=>{
            renderWithStub(MockPage,{route:"/for-testing"});
            expect(screen.getByText("for testing use only"));
        })

    });
    
});

describe("renderWithProviderAndRouter function",()=>{
    
    describe("render the component as page directly for testing use",()=>{
        
        const MockPage = vi.fn().mockImplementation(()=>{
            return <div>for testing use only</div>;
        })
        it("render the page with text 'for testing use only'",()=>{
            renderWithProviderAndRouter(<MockPage/>);
            expect(screen.getByText("for testing use only"));
        })

    });
    
});
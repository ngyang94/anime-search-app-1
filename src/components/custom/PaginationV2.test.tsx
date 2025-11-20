import {describe,it,expect,beforeAll,beforeEach,vi} from 'vitest';
import {screen,cleanup} from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import PaginationV2 from './PaginationV2';
import {renderWithStub} from '../../utils/test-utils';
import type { UserEvent } from '@testing-library/user-event';

describe("Header components",()=>{
    const goToPageMock = vi.fn();
    let userEvent:UserEvent;
    beforeAll(()=>{
        const pagination = {
            current_page:1,
            has_next_page:true,
            items:{
                count:24,
                per_page:24,
                total:48
            },
            last_visible_page:2
        }
        const MockPaginationV2 = ()=>{
            return <PaginationV2 
                pagination= {pagination}
                goToPage= {goToPageMock}
            />;
        }
        const {user}=renderWithStub(MockPaginationV2,{route:"/"});
        userEvent=user;
    })
    it("display pagination component",()=>{
        expect(screen.getByText("Previous")).toBeInTheDocument();
        expect(screen.getByText("Next")).toBeInTheDocument();
    })
    describe("when user click on",()=>{
        beforeEach(()=>{
            vi.resetAllMocks();
            cleanup();
        });
        it("Previous button, it trigger gotoPage function",async ()=>{

            const pagination = {
                current_page:2,
                has_next_page:true,
                items:{
                    count:24,
                    per_page:24,
                    total:48
                },
                last_visible_page:2
            }
            const MockPaginationV2 = ()=>{
                return <PaginationV2 
                    pagination= {pagination}
                    goToPage= {goToPageMock}
                />;
            }
            const {user}=renderWithStub(MockPaginationV2,{route:"/"});
            userEvent=user;
            
            await userEvent.click(screen.getByText("Previous"));
            await expect(goToPageMock).toBeCalledTimes(1);
        });
        it("Next button, it trigger gotoPage function",async ()=>{

            const pagination = {
                current_page:1,
                has_next_page:true,
                items:{
                    count:24,
                    per_page:24,
                    total:48
                },
                last_visible_page:2
            }
            const MockPaginationV2 = ()=>{
                return <PaginationV2 
                    pagination= {pagination}
                    goToPage= {goToPageMock}
                />;
            }
            const {user}=renderWithStub(MockPaginationV2,{route:"/"});
            userEvent=user;
            
            await userEvent.click(screen.getByText("Next"));
            await expect(goToPageMock).toBeCalledTimes(1);
        });
    });
    
});
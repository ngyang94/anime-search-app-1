
vi.mock('@/components/ui/skeleton', async() => {
    const actual = await vi.importActual('@/components/ui/skeleton');
    return {
        __esModule: true,
        ...actual,
        Skeleton: () => <div>skeleton-mock</div>,
    };
});

vi.mock('@/components/ui/spinner',async ()=>{
    const actual = await vi.importActual('@/components/ui/spinner');
    return {
        __esModule:true,
        ...actual,
        Spinner:()=><div data-testid="spinner-mock">spinner-mock</div>
    };
});

vi.mock('lucide-react',async ()=>{
    const actual = await vi.importActual('lucide-react');
    return {
        __esModule:true,
        ...actual,
        Search:()=><div>search-mock</div>
    };
});


import {describe, it, expect, beforeAll, beforeEach,vi} from 'vitest';
import {screen,waitFor} from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import type {UserEvent} from '@testing-library/user-event';

import Home from './Home';
import {renderWithProviderAndRouter} from '../../utils/test-utils';


describe("Home page", ()=>{
    let userEvent:UserEvent;
    beforeAll(()=>{
        const {user} = renderWithProviderAndRouter(<Home/>);
        userEvent = user;
    });
    beforeEach(()=>{
        globalThis.fetch = vi.fn().mockImplementation(async()=>{
            await new Promise((resolve)=>{setTimeout(()=>{
                resolve("");
            },2000)})
            return {
                ok:true,
                json:()=>{
                    return {
                        data:[
                            {
                                images:{
                                    jpg:{
                                        image_url:"./test-image.jpg"
                                    }
                                },
                                title:"this is a test title",
                                title_japanese:"this is a test japanense title",
                                score:5.0,
                                popularity:10,
                                synopsis:"this is a test synopsis"
                            }
                        ],
                        pagination:{
                            current_page:1,
                            has_next_page:true,
                            items:{
                                count:24,
                                per_page:24,
                                total:48,
                            },
                            last_visible_page:2
                        }
                    };
                }
            }
        });
    });

    describe("when home page first load", ()=>{

        it("show skeleton when first loading data at home page",async()=>{
            
            const animeListEl = screen.getByTestId("anime-list");
            expect(animeListEl).toHaveTextContent("skeleton-mock");
            
        })
        
        it("show preloader near the search input when first loading data at home page",async()=>{
            
            await waitFor(()=>expect(screen.getByText("search-mock")).toBeInTheDocument());
            // await waitForElementToBeRemoved(()=>screen.getByText("search-mock"));

            await waitFor(()=>{
                expect(screen.getByTestId("input-group-search-anime")).toHaveTextContent("spinner-mock");
            },{timeout:3500});

            
        })
        
        it("display first load after loaded data at home page",async()=>{
            
            await waitFor(()=>{
                expect(screen.getByText("search-mock")).toHaveTextContent("search-mock");
            },{timeout:2000});
            await waitFor(()=>{
                expect(screen.getByText(/this is a test title/i)).toHaveTextContent('this is a test title');
            });

        })

    });
    
    describe("when user input anime to anime search input field",()=>{
        
        it("wait for 1500ms after user stop typing then show spinner when fetching anime data",async()=>{
            
            expect(globalThis.fetch).toHaveBeenCalledTimes(0);
            userEvent.type(screen.getByPlaceholderText(/search/i),'test anime');
            await waitFor(()=>expect(globalThis.fetch).toHaveBeenCalledTimes(1),{timeout:2000});
            await waitFor(()=>{
                expect(screen.getByText("spinner-mock")).toHaveTextContent("spinner-mock");
            },{timeout:2000});
            await waitFor(()=>{
                expect(screen.getByText("search-mock")).toHaveTextContent("search-mock");
            },{timeout:2000});
        });
    });
    describe("when user click on ",()=>{
        
        it("the page header, it will reset the page and search with empty anime name for anime list again",async()=>{
            
            const header = screen.getByRole("heading",{name:/anime search app/i});
            await userEvent.click(header);
            await waitFor(()=>{
                expect(screen.getByText("spinner-mock")).toHaveTextContent("spinner-mock");
            },{timeout:2000});
            await waitFor(()=>{
                expect(globalThis.fetch).toHaveBeenCalledTimes(1);
            });
            await waitFor(()=>{
                expect(screen.getByText("search-mock")).toHaveTextContent("search-mock");
            },{timeout:2000});
        });
        it("the Next button of the pagination UI, it will trigger fetch request",async()=>{
            globalThis.fetch = vi.fn().mockImplementation(async()=>{
                await new Promise((resolve)=>{setTimeout(()=>{
                    resolve("");
                },2000)})
                return {
                    ok:true,
                    json:()=>{
                        return {
                            data:[
                                {
                                    images:{
                                        jpg:{
                                            image_url:"./test-image.jpg"
                                        }
                                    },
                                    title:"this is a test title",
                                    title_japanese:"this is a test japanense title",
                                    score:5.0,
                                    popularity:10,
                                    synopsis:"this is a test synopsis"
                                }
                            ],
                            pagination:{
                                current_page:2,
                                has_next_page:true,
                                items:{
                                    count:24,
                                    per_page:24,
                                    total:48,
                                },
                                last_visible_page:2
                            }
                        };
                    }
                }
            });

            await waitFor(()=>{
                expect(screen.getByText("Next")).toBeInTheDocument();
            });

            await userEvent.click(screen.getByText("Next"));
            
            await waitFor(()=>{
                expect(screen.getByText("spinner-mock")).toHaveTextContent("spinner-mock");
            },{timeout:2000});
            await waitFor(()=>{
                expect(globalThis.fetch).toHaveBeenCalledTimes(1);
            });
            await waitFor(()=>{
                expect(screen.getByText("search-mock")).toHaveTextContent("search-mock");
                
            },{timeout:2000});

        });

        
        it("the Previous button of the pagination UI, it will trigger fetch request",async()=>{
            
            await userEvent.click(screen.getByText("Previous"));
            
            await waitFor(()=>{
                expect(screen.getByText("spinner-mock")).toHaveTextContent("spinner-mock");
            },{timeout:3000});
            
            await waitFor(()=>{
                expect(globalThis.fetch).toHaveBeenCalledTimes(1);
            });
            
            await waitFor(()=>{
                expect(screen.getByText("search-mock")).toHaveTextContent("search-mock");
            },{timeout:2000});
            
        });
    });

});
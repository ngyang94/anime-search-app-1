import {describe,it,expect,beforeAll,afterAll} from 'vitest';
import {screen,cleanup} from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import {renderWithStub} from '../../utils/test-utils';
import AnimeDetails from './AnimeDetails';

describe("AnimeDetails page",()=>{
    beforeAll(()=>{
        
        const state = {
            images:{
                jpg:{
                    image_url:"./test-image.jpg"
                }
            },
            title:"this is a test title",
            title_japanese:"this is a test japanense title",
            score:"5.0",
            popularity:"10",
            synopsis:"this is a test synopsis"
        };

        // render the app stub at "/anime-details"
        renderWithStub( AnimeDetails,{route : '/', state : state} );

    });
    afterAll(()=>{
        cleanup();
    });
    it("display anime details",async()=>{

        expect(screen.getByRole("img",{name:"this is a test title"})).toBeInTheDocument();
        expect(screen.getByText("this is a test title")).toBeInTheDocument();
        expect(screen.getByText("this is a test japanense title")).toBeInTheDocument();
        expect(screen.getByText("5.0")).toBeInTheDocument();
        expect(screen.getByText("10")).toBeInTheDocument();
        expect(screen.getByText("this is a test synopsis")).toBeInTheDocument();

    })
});
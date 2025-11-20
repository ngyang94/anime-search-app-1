import {describe,it,expect,beforeAll,vi} from 'vitest';
import {screen} from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import Header from './Header';
import {renderWithStub} from '../../utils/test-utils';
import type { UserEvent } from '@testing-library/user-event';

const onClickMock = vi.fn();
describe("Header components",()=>{
    let userEvent:UserEvent;
    beforeAll(()=>{
        const MockHeader = ()=>{
            return <Header onClick={onClickMock}/>;
        }
        const {user}=renderWithStub(MockHeader,{route:"/"});
        userEvent=user;
    })
    it("display header title 'Anime Search App'",()=>{
        expect(screen.getByText("Anime Search App")).toBeInTheDocument();
    })
    it("when user click on header",async ()=>{
        await userEvent.click(screen.getByText("Anime Search App"));
        await expect(onClickMock).toBeCalledTimes(1);
    });
});
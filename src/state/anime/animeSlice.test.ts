import { describe, test, expect, beforeEach, vi, type Mock } from "vitest";
import reducer, { getAnimeList } from "./animeSlice";
import type { animeListType, paginationType, apiStatus } from "../../models/anime";

// Define the state type the slice uses
interface AnimeState {
    animeList: animeListType;
    pagination: paginationType;
    apiStatus: apiStatus;
}

describe("animeSlice", () => {
    const initialState: AnimeState = {
        animeList: [],
        pagination: null,
        apiStatus: null
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    // ---------- Mock Fetch Helper ----------
    function mockFetch(
        data: any,
        ok: boolean = true,
        status: number = 200,
        statusText: string = "OK"
    ) {
        globalThis.fetch = vi.fn().mockResolvedValue({
            ok,
            status,
            statusText,
            json: async () => data
        }) as unknown as Mock;
    }

    // ---------- Reducer Tests ----------
    test("fulfilled: updates state correctly", () => {
        const payload = {
            data: [{ id: 1, title: "Naruto" }],
            pagination: { page: 1, has_next_page: false },
            apiStatus: { status: 200, statusText: "", message: "" }
        };

        const action = {
            type: getAnimeList.fulfilled.type,
            payload
        };

        const newState = reducer(initialState, action);

        expect(newState.animeList).toEqual(payload.data);
        expect(newState.pagination).toEqual(payload.pagination);
        expect(newState.apiStatus).toEqual(payload.apiStatus);
    });

    test("rejected: sets error apiStatus", () => {
        const errorMessage = "API return status : 500 Server Error";

        const action = {
            type: getAnimeList.rejected.type,
            error: { message: errorMessage }
        };

        const newState = reducer(initialState, action);

        expect(newState.animeList).toEqual([]);
        expect(newState.pagination).toBeNull();
        expect(newState.apiStatus).toEqual({
            status: "Error",
            statusText: errorMessage,
            message: errorMessage
        });
    });

    // ---------- Thunk Tests ----------
    test("getAnimeList: successful fetch", async () => {
        const apiResponse = {
            data: [{ id: 99, title: "Bleach" }],
            pagination: { page: 1 }
        };

        mockFetch(apiResponse);

        const abortController = new AbortController();

        const dispatch = vi.fn();
        const getState = () => initialState;

        const result: any = await getAnimeList({
            animeName: "Bleach",
            abortController,
            page: 1,
            limit: 24
        })(dispatch, getState, undefined);

        expect(globalThis.fetch).toHaveBeenCalledOnce();
        expect(result.payload.data).toEqual(apiResponse.data);
    });

    test("getAnimeList: aborted fetch returns 499 error", async () => {
        const abortController = new AbortController();
        abortController.abort();

        globalThis.fetch = vi.fn().mockResolvedValue({
            ok: false,
            status: "Aborted",
            statusText: "Client Closed Request"
        }) as unknown as Mock;

        const dispatch = vi.fn();
        const getState = () => initialState;

        const result: any = await getAnimeList({
            animeName: "cancel",
            abortController,
            page: 1,
            limit: 24
        })(dispatch, getState, undefined);

        expect(result.error.message).toBe("499 Client Closed Request");
    });
});
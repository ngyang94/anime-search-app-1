import { describe, test, expect, beforeEach, vi, type Mock } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import animeReducer, { getAnimeList } from "./anime/animeSlice";

describe("Redux Store Integration Test", () => {
    const makeStore = () =>
        configureStore({
            reducer: {
                anime: animeReducer
            }
        });

    beforeEach(() => {
        vi.resetAllMocks();
    });

    test("store initializes with correct default state", () => {
        const store = makeStore();
        const state = store.getState();

        expect(state.anime).toEqual({
            animeList: [],
            pagination: null,
            apiStatus: null
        });
    });

    test("dispatch(getAnimeList) updates store state on success", async () => {
        const mockResponse = {
            data: [{ id: 1, title: "One Piece" }],
            pagination: { page: 1 }
        };

        globalThis.fetch = vi.fn().mockResolvedValue({
            ok: true,
            status: 200,
            statusText: "OK",
            json: async () => mockResponse
        }) as unknown as Mock;

        const store = makeStore();

        const abortController = new AbortController();

        await store.dispatch(
            getAnimeList({
                animeName: "One Piece",
                abortController,
                page: 1,
                limit: 24
            })
        );

        const state = store.getState().anime;

        expect(state.animeList).toEqual(mockResponse.data);
        expect(state.pagination).toEqual(mockResponse.pagination);
        expect(state.apiStatus?.status).toBe(200);
    });

    test("dispatch(getAnimeList) handles error properly", async () => {
        // const errorMsg = "API return status : 500 Internal Server Error";

        globalThis.fetch = vi.fn().mockResolvedValue({
            ok: false,
            status: 500,
            statusText: "Internal Server Error"
        }) as unknown as Mock;

        const store = makeStore();

        const abortController = new AbortController();

        await store.dispatch(
            getAnimeList({
                animeName: "whatever",
                abortController
            })
        );

        const state = store.getState().anime;

        expect(state.animeList).toEqual([]);
        expect(state.pagination).toBeNull();
        expect(state.apiStatus?.status).toBe("Error");
        expect(state.apiStatus?.message).toContain("500");
    });
});
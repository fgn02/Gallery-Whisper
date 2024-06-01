import { apiSlice } from "./apiSlice";

const ARTIST_URL = '/api/artist';

export const artistApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getArtistByName: builder.query({
            query: (name) => ({
                url: `${ARTIST_URL}/${name}`,
            }),
        }),
        
        getAllArtist: builder.query({
            query: () => ({
                url: `${ARTIST_URL}`,
            }),
        }),

        addArtist: builder.mutation({
            query: (artist) => ({
                url: `${ARTIST_URL}`,
                method: 'POST',
                body: artist,
            }),
        }),

        removeArtist: builder.mutation({
            query: (artist) => ({
                url: `${ARTIST_URL}`,
                method: 'DELETE',
                body: artist,
            }),
        }),

        updateArtist: builder.mutation({
            query: (artist) => ({
                url: `${ARTIST_URL}`,
                method: 'PUT',
                body: artist,
            }),
        }),

        updateArtistVerificationStatus: builder.mutation({
            query: (artist) => ({
                url: `${ARTIST_URL}/verification`,
                method: 'PUT',
                body: artist,
            }),
        }),
}),
})

export const {
    useGetArtistByNameQuery,
    useGetAllArtistQuery,
    useAddArtistMutation,
    useRemoveArtistMutation,
    useUpdateArtistMutation,
    useUpdateArtistVerificationStatusMutation,
} = artistApiSlice;
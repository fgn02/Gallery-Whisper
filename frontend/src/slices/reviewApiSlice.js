import { apiSlice } from "./apiSlice";

const REVIEW_URL = '/api/reviews';

export const reviewApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createReview: builder.mutation({
            query: (review) => ({
                url: `${REVIEW_URL}`,
                method: 'POST',
                body: review,
            }),
        }),
        getReview: builder.query({
            query: (productId) => ({
                url: `${REVIEW_URL}/${productId}`,
            }),
        }),

        deleteReview: builder.mutation({
            query: (reviewId) => ({
                url: `${REVIEW_URL}`,
                method: 'DELETE',
                body: { id: reviewId },
            }),
        }),
        getAllReviews: builder.query({
            query: () => `${REVIEW_URL}`,
        }),

    })
})
export const { useCreateReviewMutation, useGetReviewQuery,
useDeleteReviewMutation, useGetAllReviewsQuery } = reviewApiSlice;
export default reviewApiSlice;
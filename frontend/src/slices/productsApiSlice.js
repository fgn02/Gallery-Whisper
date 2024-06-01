import { apiSlice } from "./apiSlice";

const PRODUCT_URL = '/api/products';

export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllProduct: builder.query({
            query: () => ({
                url: `${PRODUCT_URL}`,
            })
        }),
        getCategory: builder.query({
            query: () => ({
                url: `${PRODUCT_URL}/category`,
            })
        }),
        getCategoryProducts: builder.query({
            query: (cat) => ({
                url: `${PRODUCT_URL}/category/${cat}`,
            })
        }),
        getProductById: builder.query({
            query: (productId) => ({
                url: `${PRODUCT_URL}/${productId}`,
            })
        }),
        getProductByFilter: builder.query({
            query: (filter) => ({
                url: `${PRODUCT_URL}/filter/${filter}`,
            }),
        }),

        getProductBySearch: builder.query({
            query: (search) => ({
                url: `${PRODUCT_URL}/search/${search}`,
            }),
        }),
        updateProduct: builder.mutation({
            query: (product) => ({
                url: `${PRODUCT_URL}`,
                method: 'PUT',
                body: product,
            }),
        }),

        createProduct: builder.mutation({
            query: (product) => ({
                url: `${PRODUCT_URL}`,
                method: 'POST',
                body: product,
            }),
        }),

        deleteProduct: builder.mutation({
            query: (productId) => ({
                url: `${PRODUCT_URL}`,
                method: 'DELETE',
                body: productId,
            }),
        }),
    })
    
})

export const { useGetAllProductQuery, useGetProductByIdQuery, 
    useGetCategoryQuery, useGetCategoryProductsQuery, 
    useGetProductByFilterQuery, useGetProductBySearchQuery,
    useUpdateProductMutation, useCreateProductMutation,
    useDeleteProductMutation
 } = productsApiSlice;
export default productsApiSlice ;
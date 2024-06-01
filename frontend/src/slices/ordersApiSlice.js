import { apiSlice } from "./apiSlice";

const ORDER_URL = '/api/orders';
const PAYPAL_URL = '/api/config/paypal';


export const ordersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (order) => ({
                url: `${ORDER_URL}`,
                method: 'POST',
                body: order,
            }),
        }),
        getOrderById: builder.query({
            query: (orderId) => ({
                url: `${ORDER_URL}/${orderId}`,
            }),
        }),

        getPaypalClientId : builder.query({
            query: () => ({
                url: `${PAYPAL_URL}`,
            }),
        }),

        payOrder : builder.mutation({
            query: ({ orderId, details }) => ({
                url: `${ORDER_URL}/${orderId}/pay`,
                method: 'PUT',
                body: details,
            }),
        }),

        markAsDelivered : builder.mutation({
            query: ({ orderId }) => ({
                url: `${ORDER_URL}/${orderId}/deliver`,
                method: 'PUT',
            }),
        }),

        getAllOrders: builder.query({
            query: () => ({
                url: `${ORDER_URL}/admin`,
            }),
        }),

        getMyOrders: builder.query({
            query: ({ userId }) => ({
                url: `${ORDER_URL}/myorders/${userId}`,
            }),
        }),

        cancelOrder: builder.mutation({
            query: ({ orderId }) => ({
                url: `${ORDER_URL}/cancel`,
                method: 'PUT',
                body: {orderId},
            }),
        }),
        
        getFilterOrders: builder.query({
            query: ({ filter }) => ({
                url: `${ORDER_URL}/filter/${filter}`,
            }),
        }),

        getMyFilterOrders : builder.query({
            query: ({ userId, filter }) => ({
                url: `${ORDER_URL}/myorders/${userId}/filter/${filter}`,
            }),
        }),

        getSalesOrder : builder.query({
            query: () => ({
                url: `${ORDER_URL}/admin/totalSale`,
            }),
        }),

        getTopProducts : builder.query({
            query: () => ({
                url: `${ORDER_URL}/admin/topProduct`,
            }),
        }),

        getTopCategory : builder.query({
            query: () => ({
                url: `${ORDER_URL}/admin/topCategory`,
            }),
        }),
}),
})

export const { useCreateOrderMutation, 
    useGetOrderByIdQuery, 
    useGetPaypalClientIdQuery,
    usePayOrderMutation, 
    useMarkAsDeliveredMutation, 
    useGetAllOrdersQuery,
    useGetMyOrdersQuery,
    useCancelOrderMutation,
    useGetFilterOrdersQuery,
    useGetMyFilterOrdersQuery,
    useGetSalesOrderQuery,
    useGetTopProductsQuery,
    useGetTopCategoryQuery,
} = ordersApiSlice;
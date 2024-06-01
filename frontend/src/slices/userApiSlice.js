import { apiSlice } from "./apiSlice";

const USERS_URL = '/api/users';

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/auth`,
                method: 'POST',
                body: data,
            })
        }),
        logout: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/logout`,
                method: 'POST',
            })
        }),
        register: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}`,
                method: 'POST',
                body: data,
            })
        }),
        updateUser: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/profile`,
                method: 'PUT',
                body: data,
            })
        }),

        addFavorite: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/my/favorite`,
                method: 'PUT',
                body: data,
            }),
        }),

        getFavorite: builder.query({
            query: () => ({
                url: `${USERS_URL}/favorite`,
            }),
        }),

        getAllUsers: builder.query({
            query: () => ({
                url: `${USERS_URL}/admin/users`,
            }),
        }),

        makeAdmin: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/admin/makeadmin`,
                method: 'PUT',
                body: data,
            }),
        }),

        removeAdmin: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/admin/removeadmin`,
                method: 'PUT',
                body: data,
            }),
        }),
        removeUser: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/admin/removeuser`,
                method: 'DELETE',
                body: data,
            }),
        }),
        googleLogin: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/googlelogin`,
                method: 'POST',
                body: data,
            }),
        }),

        googleReg: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/googleregister`,
                method: 'POST',
                body: data,
            }),
        }),
    })
    
})

export const { useLoginMutation,
     useLogoutMutation, 
     useRegisterMutation, 
     useUpdateUserMutation,
     useAddFavoriteMutation,
     useGetFavoriteQuery,
     useGetAllUsersQuery,
     useMakeAdminMutation,
    useRemoveAdminMutation,
    useRemoveUserMutation,
    useGoogleLoginMutation,
    useGoogleRegMutation,
 } = usersApiSlice;
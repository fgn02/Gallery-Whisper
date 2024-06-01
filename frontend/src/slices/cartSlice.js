import {createSlice} from '@reduxjs/toolkit';
import { updateCart } from '../components/cartUtil';

const initialState = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : {user_id: '', cartItems: [], shippingAddress: {}, paymentMethod: ''};
const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
      cartAdd: (state, action) => {
        const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);
      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }

      return updateCart(state, item);
    },

    removeFromCart: (state, action) => {
     state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      return updateCart(state);
    },

    clearCart: (state) => {
      state.cartItems = [];
      return updateCart(state);
    },
      saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    saveUser: (state, action) => {
      state.user_id = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    },
});

export const {
  cartAdd, 
  removeFromCart, 
  clearCart, 
  saveShippingAddress, 
  savePaymentMethod, 
  saveUser} = cartSlice.actions;
export default cartSlice.reducer;
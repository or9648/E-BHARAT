import { createSlice } from '@reduxjs/toolkit'

const initialState = JSON.parse(localStorage.getItem('cart')) ?? [];

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart(state, action) {
            // Using Immer (from Redux Toolkit) to handle state mutation safely
            state.push(action.payload);
        },
        deleteFromCart(state, action) {
            // Return a new array with filtered items (ensures immutability)
            return state.filter(item => item.id !== action.payload.id);
        },
        incrementQuantity: (state, action) => {
            // Modify quantity immutably
            return state.map(item => 
                item.id === action.payload 
                ? { ...item, quantity: item.quantity + 1 } 
                : item
            );
        },
        decrementQuantity: (state, action) => {
            // Decrease quantity immutably, but only if quantity is greater than 1
            return state.map(item => 
                item.id === action.payload && item.quantity > 1 
                ? { ...item, quantity: item.quantity - 1 } 
                : item
            );
        },
    },
})

// Action creators are generated for each case reducer function
export const { addToCart, deleteFromCart, incrementQuantity, decrementQuantity } = cartSlice.actions

export default cartSlice.reducer;

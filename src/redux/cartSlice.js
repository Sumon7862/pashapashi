import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "cart",
  initialState: { items: [] },
  reducers: {
    addToCart(state, { payload }) {
      const { product, qty } = payload;
      const found = state.items.find(i => i.id === product.id);
      if (found) found.qty += qty;
      else state.items.push({ ...product, qty });
    },
    removeFromCart(state, { payload }) {
      state.items = state.items.filter(i => i.id !== payload);
    },
    inc(state, { payload }) {
      const i = state.items.find(i => i.id === payload);
      if (i) i.qty++;
    },
    dec(state, { payload }) {
      const i = state.items.find(i => i.id === payload);
      if (i && i.qty > 1) i.qty--;
    },
    clear(state) {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, inc, dec, clear } = slice.actions;
export default slice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../lib/supabase";
import { mapProduct, toProductRow } from "../lib/mappers";

export const fetchProducts = createAsyncThunk("products/fetch", async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data.map(mapProduct);
});

export const addProduct = createAsyncThunk("products/add", async product => {
  const { data, error } = await supabase
    .from("products")
    .insert(toProductRow(product))
    .select()
    .single();
  if (error) throw error;
  return mapProduct(data);
});

export const deleteProduct = createAsyncThunk("products/delete", async id => {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
  return id;
});

const slice = createSlice({
  name: "products",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchProducts.pending, state => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.items = payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addProduct.fulfilled, (state, { payload }) => {
        state.items.unshift(payload);
      })
      .addCase(deleteProduct.fulfilled, (state, { payload }) => {
        state.items = state.items.filter(p => p.id !== payload);
      });
  },
});

export default slice.reducer;

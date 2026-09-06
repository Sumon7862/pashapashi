import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../lib/supabase";
import { mapOrder, toOrderRow } from "../lib/mappers";

export const fetchOrders = createAsyncThunk("orders/fetch", async () => {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data.map(mapOrder);
});

export const addOrder = createAsyncThunk("orders/add", async order => {
  const { error } = await supabase
    .from("orders")
    .insert(toOrderRow(order));
  if (error) throw error;
  return {
    ...order,
    id: order.id || crypto.randomUUID(),
    createdAt: order.createdAt || new Date().toISOString(),
  };
});

export const updateOrderStatus = createAsyncThunk(
  "orders/updateStatus",
  async ({ id, status }) => {
    const { data, error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return mapOrder(data);
  }
);

const slice = createSlice({
  name: "orders",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchOrders.pending, state => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.items = payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addOrder.fulfilled, (state, { payload }) => {
        state.items.unshift(payload);
      })
      .addCase(updateOrderStatus.fulfilled, (state, { payload }) => {
        const index = state.items.findIndex(o => o.id === payload.id);
        if (index >= 0) state.items[index] = payload;
      });
  },
});

export default slice.reducer;

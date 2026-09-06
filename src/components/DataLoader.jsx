import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchProducts } from "../redux/productsSlice";
import { isSupabaseConfigured } from "../lib/supabase";

export default function DataLoader() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (isSupabaseConfigured) dispatch(fetchProducts());
  }, [dispatch]);

  return null;
}

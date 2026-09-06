import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

const VISITOR_KEY = "pashapashi_visitor";

function getVisitorKey() {
  let key = localStorage.getItem(VISITOR_KEY);
  if (!key) {
    key = crypto.randomUUID();
    localStorage.setItem(VISITOR_KEY, key);
  }
  return key;
}

export default function useSiteStats() {
  const [stats, setStats] = useState({ orders: 0, visitors: 0, online: 0 });

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const key = getVisitorKey();
    let cancelled = false;

    const refresh = async () => {
      await supabase.rpc("touch_visitor", { p_key: key });
      const { data, error } = await supabase.rpc("site_stats");
      if (cancelled || error || !data) return;
      setStats({
        orders: Number(data.orders) || 0,
        visitors: Number(data.visitors) || 0,
        online: Number(data.online) || 0,
      });
    };

    refresh();
    const timer = setInterval(refresh, 30000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  return stats;
}

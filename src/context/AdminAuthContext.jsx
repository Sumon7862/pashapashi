import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

const ADMIN_USER_ID = import.meta.env.VITE_ADMIN_USER_ID;

function isAdminSession(session) {
  if (!session?.user?.id) return false;
  if (!ADMIN_USER_ID) return true;
  return session.user.id === ADMIN_USER_ID;
}

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  const value = useMemo(() => ({
    session,
    isAdmin: isAdminSession(session),
    loading,
    configured: isSupabaseConfigured,
    login: (email, password) => {
      if (!supabase) return Promise.resolve({ error: { message: "Supabase is not configured" } });
      return supabase.auth.signInWithPassword({ email, password });
    },
    logout: () => supabase ? supabase.auth.signOut() : Promise.resolve(),
  }), [session, loading]);

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  return ctx;
}

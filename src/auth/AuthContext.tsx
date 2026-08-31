import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "./supabase";
import type { Claims, Role } from "./types";

type AuthContextType = {
  claims: Claims | null;
  role: Role;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [claims, setClaims] = useState<Claims | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadClaims = async () => {
      const { data, error } = await supabase.auth.getClaims();
      setClaims(error || !data ? null : (data.claims as Claims));
      setLoading(false);
    };

    loadClaims();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async () => {
      const { data, error } = await supabase.auth.getClaims();
      setClaims(error || !data ? null : (data.claims as Claims));
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const role: Role = (claims?.user_role as Role) ?? "user";

  const signOut = async () => {
    await supabase.auth.signOut();
    setClaims(null);
  };

  return (
    <AuthContext.Provider value={{ claims, role, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside an <AuthProvider>");
  }
  return ctx;
}

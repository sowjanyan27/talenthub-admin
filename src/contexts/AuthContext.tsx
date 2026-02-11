import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { checkTenant, validateLogin } from "../lib/api";
import { useNavigate } from "react-router-dom";
interface AuthContextType {
  user: any;
  loading: boolean;
  login: (accountId: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (accountId: string, email: string, password: string) => {
    setLoading(true);
    try {
      // 🔹 STEP 1: Check tenant
      const tenantToken = await checkTenant(accountId);

      // store tenant token
      localStorage.setItem("tenant_token", tenantToken);

      // 🔹 STEP 2: Validate login
      const loginData = await validateLogin(tenantToken, email, password);

      setUser(loginData.data);
      localStorage.setItem("user", JSON.stringify(loginData.data));
    } finally {
      setLoading(false);
    }
  };

const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("tenant_token");
  setUser(null);

  navigate("/"); // or "/login"
};


  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  login as loginRequest,
  logout as logoutRequest,
  getPapelSalvo,
} from "../lib/auth";
import { getCookie, LOGIN_COOKIE_NAME, TOKEN_COOKIE_NAME } from "../lib/cookies";
import type { Papel } from "../lib/types";

type AuthContextType = {
  isAuthenticated: boolean;
  loginUsuario: string | null;
  papel: Papel | null;
  login: (login: string, senha: string) => Promise<Papel>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginUsuario, setLoginUsuario] = useState<string | null>(null);
  const [papel, setPapel] = useState<Papel | null>(null);
  const router = useRouter();

  // Ao carregar qualquer página, verifica se já existe um token salvo
  // (ex: a pessoa já tinha logado antes e deu refresh na página).
  useEffect(() => {
    const token = getCookie(TOKEN_COOKIE_NAME);
    setIsAuthenticated(!!token);
    setLoginUsuario(getCookie(LOGIN_COOKIE_NAME));
    setPapel(getPapelSalvo());
  }, []);

  async function login(loginValue: string, senha: string): Promise<Papel> {
    // loginRequest lança ApiError se as credenciais forem inválidas —
    // deixamos o erro "subir" para quem chamou (a tela de login decide
    // o que mostrar pro usuário).
    const papelUsuario = await loginRequest(loginValue, senha);
    setIsAuthenticated(true);
    setLoginUsuario(loginValue);
    setPapel(papelUsuario);
    return papelUsuario;
  }

  function logout() {
    logoutRequest();
    setIsAuthenticated(false);
    setLoginUsuario(null);
    setPapel(null);
    router.push("/login");
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loginUsuario, papel, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook usado em qualquer componente para acessar login/logout/estado:
//   const { isAuthenticated, login, logout, loginUsuario } = useAuth();
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth precisa ser usado dentro de um <AuthProvider>");
  }
  return context;
}

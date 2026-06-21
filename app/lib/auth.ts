import { apiFetch } from "./api";
import {
  setCookie,
  deleteCookie,
  TOKEN_COOKIE_NAME,
  LOGIN_COOKIE_NAME,
} from "./cookies";
import type { LoginResponse } from "./types";

// O token gerado pelo backend (TokenService.java) expira em 2 horas.
// Mantemos o cookie com a mesma duração.
const DUAS_HORAS_EM_SEGUNDOS = 60 * 60 * 2;

export async function login(loginUsuario: string, senha: string): Promise<void> {
  const data = await apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: { login: loginUsuario, senha },
    auth: false, // login não envia (e não precisa de) token
  });

  setCookie(TOKEN_COOKIE_NAME, data.token, DUAS_HORAS_EM_SEGUNDOS);
  // Guardamos também o "login" que a pessoa digitou (geralmente o e-mail)
  // só para conseguir mostrar algo na tela (ex: na Sidebar). O backend hoje
  // não tem um endpoint "/usuarios/me" que devolva nome/papel do usuário —
  // veja o README do pacote de integração para mais detalhes sobre isso.
  setCookie(LOGIN_COOKIE_NAME, loginUsuario, DUAS_HORAS_EM_SEGUNDOS);
}

export function logout(): void {
  deleteCookie(TOKEN_COOKIE_NAME);
  deleteCookie(LOGIN_COOKIE_NAME);
}

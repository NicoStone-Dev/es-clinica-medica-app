import { apiFetch } from "./api";
import {
  setCookie,
  deleteCookie,
  getCookie,
  TOKEN_COOKIE_NAME,
  LOGIN_COOKIE_NAME,
  PAPEL_COOKIE_NAME,
} from "./cookies";
import type { LoginResponse, UsuarioDetalhe, Papel } from "./types";

// O token gerado pelo backend (TokenService.java) expira em 2 horas.
// Mantemos o cookie com a mesma duração.
const DUAS_HORAS_EM_SEGUNDOS = 60 * 60 * 2;

// Busca os dados do usuário autenticado (id, login, papel) em GET /usuarios/me.
// O JWT só carrega o login, então é daqui que o front descobre o papel (cargo).
export async function getMe(): Promise<UsuarioDetalhe> {
  return apiFetch<UsuarioDetalhe>("/usuarios/me");
}

export async function login(loginUsuario: string, senha: string): Promise<Papel> {
  const data = await apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: { login: loginUsuario, senha },
    auth: false, // login não envia (e não precisa de) token
  });

  setCookie(TOKEN_COOKIE_NAME, data.token, DUAS_HORAS_EM_SEGUNDOS);
  // Guardamos também o "login" que a pessoa digitou (geralmente o e-mail)
  // só para conseguir mostrar algo na tela (ex: na Sidebar).
  setCookie(LOGIN_COOKIE_NAME, loginUsuario, DUAS_HORAS_EM_SEGUNDOS);

  // Com o token já salvo, descobrimos o papel do usuário e o guardamos em
  // cookie para filtrar a navegação e redirecionar para a tela inicial certa.
  const me = await getMe();
  setCookie(PAPEL_COOKIE_NAME, me.papel, DUAS_HORAS_EM_SEGUNDOS);
  return me.papel;
}

export function getPapelSalvo(): Papel | null {
  return getCookie(PAPEL_COOKIE_NAME) as Papel | null;
}

export function logout(): void {
  deleteCookie(TOKEN_COOKIE_NAME);
  deleteCookie(LOGIN_COOKIE_NAME);
  deleteCookie(PAPEL_COOKIE_NAME);
}

// Funções simples para ler/escrever cookies no navegador.
//
// Por que cookie e não localStorage?
// Porque o middleware.ts (que protege as rotas, ex: redirecionar pro /login
// se o usuário não estiver autenticado) roda no SERVIDOR do Next.js, e o
// servidor só tem acesso a cookies — ele não consegue ler o localStorage do
// navegador. Usando cookie, tanto o front (no navegador) quanto o middleware
// (no servidor) conseguem checar se existe um token salvo.

export const TOKEN_COOKIE_NAME = "clinica_token";
export const LOGIN_COOKIE_NAME = "clinica_login";

export function setCookie(name: string, value: string, maxAgeSeconds: number) {
  if (typeof document === "undefined") return; // só existe no navegador
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
}

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; max-age=0`;
}

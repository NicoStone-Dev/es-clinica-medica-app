import { NextRequest, NextResponse } from "next/server";

// Rotas que exigem login. Hoje só /appointment tem uma página de fato — as
// outras (dashboard, management, settings) aparecem no menu (config/Routes.tsx)
// mas ainda não têm page.tsx criado. Adicione aqui conforme forem sendo criadas.
const ROTAS_PROTEGIDAS = ["/dashboard", "/appointment", "/management", "/settings"];

export function proxy(request: NextRequest) {
  const token = request.cookies.get("clinica_token")?.value;
  const { pathname } = request.nextUrl;

  const precisaLogin = ROTAS_PROTEGIDAS.some((rota) => pathname.startsWith(rota));

  if (precisaLogin && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Se já está logado e tenta acessar /login de novo, manda direto pro app
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/appointment", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/appointment/:path*",
    "/management/:path*",
    "/settings/:path*",
    "/login",
  ],
};

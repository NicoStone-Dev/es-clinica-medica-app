"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { RouteConfig, routes } from "@/config/Routes";
import Image from "next/image";
import { Button } from "@/app/components/Button/Button";
import { useAuth } from "@/app/context/AuthContext";

import { Add, ExitToApp } from "@mui/icons-material";

function NavItem({ route, active }: { route: RouteConfig; active: boolean }) {
  const Icon = route.icon;

  return (
    <Link
      href={route.path}
      title={route.title}
      className={`flex items-center justify-between px-[42px] py-[12px] rounded-[12px] text-body transition-colors gap-2
        hover:bg-surface hover:text-blue-gray-600

        ${
          active
            ? "bg-[linear-gradient(90deg,#C2D4F1_38.94%,#F8FBFF_100%)] text-blue-gray-600 font-bold"
            : "bg-blue-50 text-blue-gray-400 hover:bg-surface-secondary"
        }
      
      `}
    >
      <span>{route.title}</span>
      <Icon size={24} />
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const { loginUsuario, logout } = useAuth();

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + "/");

  return (
    <nav
      className={`flex flex-col h-screen bg-blue-gray-100 shrink-0 transition-all duration-300 w-75 py-4`}
    >
      {/* Logo and tabs */}
      <div className="flex flex-col h-full gap-[64px]">
        {/* logo */}

        <div className="flex flex-col items-left px-5">
          <Image width={180} height={100} src="/images/logo.svg" alt="" />
          <p className="font-regular text-body text-gray-500 mt-xs">
            Gerenciamento de Consultas
          </p>
        </div>
        {/* tabs */}
        <div className="flex flex-col gap-3 px-sm pt-md flex-1">
          {routes.map((route) => (
            <NavItem
              key={route.path}
              route={route}
              active={isActive(route.path)}
            />
          ))}
        </div>
      </div>

      <div className=" flex flex-col gap-10 w-full px-5">
        <Button onClick={() => {}}>
          Nova consulta
          <Add />
        </Button>
        <div className="flex flex-row">
          <div className="flex flex-row w-full items-center gap-3">
            <Image
              width={36}
              height={36}
              src="/images/profile-mock.png"
              alt="logo"
            />
            <div className="flex flex-col">
              {/* O backend ainda não tem um endpoint "/usuarios/me", então só
                  conseguimos mostrar o login (geralmente o e-mail) que a
                  pessoa digitou — não o nome real nem o papel (cargo). */}
              <p className=" text-blue-gray-600 font-bold">
                {loginUsuario ?? "Usuário"}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="bg-transparent text-blue-gray-600 hover:text-blue-gray-400 w-fit"
          >
            <ExitToApp />
          </button>
        </div>
      </div>
    </nav>
  );
}

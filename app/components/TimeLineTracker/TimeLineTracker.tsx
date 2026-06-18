"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { RouteConfig, appointmentFlowRoutes } from "@/config/Routes";

function NavItem({ route, active }: { route: RouteConfig; active: boolean }) {
  const Icon = route.icon;

  return (
    <div className="flex flex-row items-center">
      <Link
        href={route.path}
        title={route.title}
        className={`flex items-center justify-center w-12 h-12 rounded-full text-body transition-colors gap-2
        hover:opacity-70 hover:text-blue-gray-600

        ${
          active
            ? "bg-secondary text-blue-gray-600 font-bold"
            : "bg-blue-100 text-blue-gray-400 "
        }
      
      `}
      >
        <Icon />
      </Link>
    </div>
  );
}

export default function TimeLineTracker() {
  const pathname = usePathname();
  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + "/");

  return (
    <div className="flex flex-row w-150 items-center justify-center px-sm pt-md">
      {appointmentFlowRoutes.map((route) => (
        <div className="flex flex-row items-center" key={route.path}>
          <NavItem route={route} active={isActive(route.path)} />
        {
            route.path !== "/appointment/data_check" &&
            <div className="w-50 h-1 bg-blue-gray-400" />
        }
        </div>
      ))}
    </div>
  );
}

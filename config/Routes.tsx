import {
  Dashboard,
  LibraryBooks,
  ManageAccounts,
  Settings,
} from "@mui/icons-material";
import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

export type RouteConfig = {
  path: string;
  title: string;
  icon: OverridableComponent<SvgIconTypeMap<object, "svg">> & { muiName: string; };
  allowedRoles: "all";
};

export const routes: RouteConfig[] = [
  {
    path: "/dashboard",
    title: "Painel de Controle",
    icon: Dashboard,
    allowedRoles: "all",
  },
  {
    path: "/appointment",
    title: "Consultas",
    icon: LibraryBooks,
    allowedRoles: "all",
  },
  {
    path: "/management",
    title: "Gerenciamento",
    icon: ManageAccounts,
    allowedRoles: "all",
  },
  {
    path: "/setttings",
    title: "Configurações",
    icon: Settings,
    allowedRoles: "all",
  },
];

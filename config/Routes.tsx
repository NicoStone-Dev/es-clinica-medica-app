import {
  Dashboard,
  LibraryBooks,
  ManageAccounts,
  Settings,
  AssignmentInd,
  MedicalServices,
  Event,
  FactCheck,
  Today,
  Group,
  Sick,
} from "@mui/icons-material";
import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import type { Papel } from "@/app/lib/types";

export type RouteConfig = {
  path: string;
  title: string;
  icon: OverridableComponent<SvgIconTypeMap<object, "svg">> & {
    muiName: string;
  };
  // "all" = visível para qualquer usuário autenticado; ou a lista de papéis
  // que enxergam a rota (espelha a proteção @Secured do backend).
  allowedRoles: "all" | Papel[];
};

export const sidebarRoutes: RouteConfig[] = [
  {
    path: "/dashboard",
    title: "Painel de Controle",
    icon: Dashboard,
    allowedRoles: ["ADMINISTRADOR"], // GET /dashboard é só admin
  },
  {
    path: "/appointment",
    title: "Consultas",
    icon: LibraryBooks,
    allowedRoles: ["ADMINISTRADOR", "RECEPCIONISTA"],
  },
  {
    path: "/agenda",
    title: "Minha Agenda",
    icon: Today,
    allowedRoles: ["MEDICO"], // GET /consultas/agenda-do-dia é só médico
  },
  {
    path: "/management",
    title: "Gerenciamento",
    icon: ManageAccounts,
    allowedRoles: ["ADMINISTRADOR", "RECEPCIONISTA"],
  },
  {
    path: "/patients",
    title: "Pacientes",
    icon: Sick,
    allowedRoles: ["ADMINISTRADOR", "RECEPCIONISTA"],
  },
  {
    path: "/users",
    title: "Usuários",
    icon: Group,
    allowedRoles: ["ADMINISTRADOR"], // POST /usuarios é só admin
  },
  {
    path: "/setttings",
    title: "Configurações",
    icon: Settings,
    allowedRoles: "all",
  },
];

// Verifica se um papel pode ver/acessar uma rota.
export function papelPodeAcessar(
  route: RouteConfig,
  papel: Papel | null
): boolean {
  if (route.allowedRoles === "all") return true;
  if (papel === null) return false;
  return route.allowedRoles.includes(papel);
}

// Tela inicial após o login, conforme o papel do usuário.
export function rotaInicialPorPapel(papel: Papel): string {
  switch (papel) {
    case "MEDICO":
      return "/agenda";
    case "ADMINISTRADOR":
      return "/dashboard";
    case "RECEPCIONISTA":
    default:
      return "/appointment";
  }
}

export const appointmentFlowRoutes: RouteConfig[] = [
  {
    path: "/appointment/patient_register",
    title: "Fichamento do Paciente",
    icon: AssignmentInd,
    allowedRoles: "all",
  },
  {
    path: "/appointment/available_professionals",
    title: "Seleção de Profissional",
    icon: MedicalServices,
    allowedRoles: "all",
  },
  {
    path: "/appointment/date_picker",
    title: "Marcação de Consulta",
    icon: Event,
    allowedRoles: "all",
  },
  {
    path: "/appointment/data_check",
    title: "Confirmação de Dados",
    icon: FactCheck,
    allowedRoles: "all",
  },
];

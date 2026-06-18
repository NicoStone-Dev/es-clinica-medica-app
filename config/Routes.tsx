import {
  Dashboard,
  LibraryBooks,
  ManageAccounts,
  Settings,
  AssignmentInd,
  MedicalServices,
  Event,
  FactCheck
} from "@mui/icons-material";
import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

export type RouteConfig = {
  path: string;
  title: string;
  icon: OverridableComponent<SvgIconTypeMap<object, "svg">> & {
    muiName: string;
  };
  allowedRoles: "all";
};

export const sidebarRoutes: RouteConfig[] = [
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

import type { StatusConsulta } from "@/app/lib/types";

// Cores e rótulos de cada status de consulta (AGENDADA / REALIZADA / ATRASADA).
const ESTILOS: Record<StatusConsulta, string> = {
  AGENDADA: "bg-blue-100 text-primary",
  REALIZADA: "bg-green-50 text-green-600",
  ATRASADA: "bg-red-50 text-red-500",
};

const ROTULOS: Record<StatusConsulta, string> = {
  AGENDADA: "Agendada",
  REALIZADA: "Realizada",
  ATRASADA: "Atrasada",
};

export function StatusBadge({ status }: { status: StatusConsulta }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-small font-semibold ${ESTILOS[status]}`}
    >
      {ROTULOS[status]}
    </span>
  );
}

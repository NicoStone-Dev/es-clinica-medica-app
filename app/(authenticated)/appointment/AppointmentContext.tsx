"use client";

import { createContext, useContext, useState } from "react";
import type {
  PacienteResumo,
  MedicoResumo,
  Especialidade,
} from "@/app/lib/types";

// Estado da consulta sendo montada ao longo das 4 etapas do fluxo
// (paciente -> profissional -> data/hora -> confirmação). Fica em memória,
// então um refresh no meio do fluxo zera tudo e as telas redirecionam de volta
// para o início (ver os "guards" em cada página).
type AppointmentState = {
  paciente: PacienteResumo | null;
  medico: MedicoResumo | null;
  especialidade: Especialidade | null;
  dataHora: string | null; // ISO local, ex: "2026-07-01T14:00:00"
};

type AppointmentContextValue = AppointmentState & {
  setPaciente: (p: PacienteResumo | null) => void;
  setMedico: (m: MedicoResumo | null) => void;
  setEspecialidade: (e: Especialidade | null) => void;
  setDataHora: (d: string | null) => void;
  reset: () => void;
};

const AppointmentContext = createContext<AppointmentContextValue | null>(null);

export function AppointmentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [paciente, setPaciente] = useState<PacienteResumo | null>(null);
  const [medico, setMedico] = useState<MedicoResumo | null>(null);
  const [especialidade, setEspecialidade] = useState<Especialidade | null>(null);
  const [dataHora, setDataHora] = useState<string | null>(null);

  function reset() {
    setPaciente(null);
    setMedico(null);
    setEspecialidade(null);
    setDataHora(null);
  }

  return (
    <AppointmentContext.Provider
      value={{
        paciente,
        medico,
        especialidade,
        dataHora,
        setPaciente,
        setMedico,
        setEspecialidade,
        setDataHora,
        reset,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
}

export function useAppointment() {
  const ctx = useContext(AppointmentContext);
  if (!ctx) {
    throw new Error(
      "useAppointment precisa ser usado dentro de <AppointmentProvider> (ver appointment/layout.tsx)."
    );
  }
  return ctx;
}

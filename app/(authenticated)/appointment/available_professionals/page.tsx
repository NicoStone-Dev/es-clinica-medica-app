"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Table from "@/app/components/Table/Table";
import { Button } from "@/app/components/Button/Button";
import { apiFetch, ApiError } from "@/app/lib/api";
import type { MedicoResumo, Page } from "@/app/lib/types";
import { useAppointment } from "../AppointmentContext";

const COLUMNS = [
  { key: "nome" as const, label: "Nome" },
  { key: "especialidade" as const, label: "Especialidade" },
  { key: "crm" as const, label: "CRM" },
];

export default function AvailableProfessionals() {
  const router = useRouter();
  const { paciente, setMedico, setEspecialidade } = useAppointment();

  const [medicos, setMedicos] = useState<MedicoResumo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // Guard: sem paciente selecionado não dá para escolher o profissional.
  useEffect(() => {
    if (!paciente) {
      router.replace("/appointment/patient_register");
    }
  }, [paciente, router]);

  useEffect(() => {
    async function carregarMedicos() {
      setCarregando(true);
      try {
        const pagina = await apiFetch<Page<MedicoResumo>>("/medicos");
        setMedicos(pagina.content);
      } catch (e) {
        setErro(
          e instanceof ApiError ? e.message : "Erro ao carregar profissionais."
        );
      } finally {
        setCarregando(false);
      }
    }
    carregarMedicos();
  }, []);

  function selecionarMedico(medico: MedicoResumo) {
    setMedico(medico);
    setEspecialidade(medico.especialidade);
    router.push("/appointment/date_picker");
  }

  if (!paciente) return null;

  return (
    <div className="flex flex-col gap-4 px-6">
      <div className="gap-0">
        <h1 className="text-primary font-semibold text-body-emph">
          Seleção de Profissional
        </h1>
        <p className="text-blue-gray-400 font-regular text-body">
          Agendando para <span className="font-bold">{paciente.nome}</span> —
          escolha o profissional que fará o atendimento.
        </p>
      </div>

      {erro && <p className="text-red-500 text-body">{erro}</p>}

      <div className="flex flex-col">
        {carregando ? (
          <p className="text-blue-gray-400">Carregando profissionais...</p>
        ) : medicos.length === 0 ? (
          <p className="text-blue-gray-400">
            Nenhum profissional cadastrado. Cadastre um médico no backend
            (POST /medicos) antes de agendar.
          </p>
        ) : (
          <Table data={medicos} columns={COLUMNS} onRowClick={selecionarMedico} />
        )}
      </div>

      <div className="flex justify-start">
        <Button
          variant="ghost"
          type="button"
          onClick={() => router.push("/appointment/patient_register")}
        >
          Voltar
        </Button>
      </div>
    </div>
  );
}

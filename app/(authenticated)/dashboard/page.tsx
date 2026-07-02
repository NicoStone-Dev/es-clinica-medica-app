"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, EventNote } from "@mui/icons-material";

import { TextInput } from "@/app/components/TextInput/TextInput";
import Table from "@/app/components/Table/Table";
import { apiFetch, ApiError } from "@/app/lib/api";

import type { Especialidade, Page } from "@/app/lib/types";
import { useAppointment } from "../appointment/AppointmentContext";

// Assuming a standard ConsultaResumo type based on your context definitions
export type ConsultaResumo = {
  id: number;
  paciente: { nome: string };
  medico: { nome: string };
  especialidade: Especialidade;
  dataHora: string; // ISO local
};

const COLUMNS = [
  { key: "pacienteNome" as const, label: "Paciente" },
  { key: "medicoNome" as const, label: "Médico" },
  { key: "especialidade" as const, label: "Especialidade" },
  { key: "dataHoraFormatada" as const, label: "Data/Hora" },
];

export default function AppointmentSearch() {
  const router = useRouter();

  // Utilizing the context provided
  const { setEspecialidade, setDataHora } = useAppointment();

  const [consultas, setConsultas] = useState<ConsultaResumo[]>([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  async function carregarConsultas() {
    setCarregando(true);
    try {
      // Assuming a generic paginated endpoint for appointments
      const pagina = await apiFetch<Page<ConsultaResumo>>("/consultas");
      setConsultas(pagina.content);
    } catch (e) {
      setErro(
        e instanceof ApiError ? e.message : "Erro ao carregar as consultas.",
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarConsultas();
  }, []);

  // Filter exact specialty only (case-insensitive).
  // If the search bar is empty, it displays all appointments.
  const consultasFiltradas =
    busca.trim() === ""
      ? consultas
      : consultas.filter(
          (c) => c.especialidade.toUpperCase() === busca.trim().toUpperCase(),
        );

  // Flatten nested objects and format dates for the Table component to consume
  const tableData = consultasFiltradas.map((c) => ({
    ...c,
    pacienteNome: c.paciente.nome,
    medicoNome: c.medico.nome,
    dataHoraFormatada: new Date(c.dataHora).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));

  // Clicking an appointment sets context state and navigates
  function selecionarConsulta(row: (typeof tableData)[0]) {
    setEspecialidade(row.especialidade);
    setDataHora(row.dataHora);

    // Example step routing - adjust to your specific architecture
    // router.push("/appointment/details");
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="gap-0">
        <h1 className="text-primary font-semibold text-body-emph">
          Buscar Agendamentos
        </h1>
        <p className="text-blue-gray-400 font-regular text-body">
          Pesquise consultas fornecendo a especialidade exata (ex: ORTOPEDIA,
          CARDIOLOGIA).
        </p>
      </div>

      <div className="flex flex-row justify-between w-full md:w-1/2">
        <TextInput
          leftIcon={<Search />}
          placeholder="Pesquisar por especialidade..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      {erro && <p className="text-red-500 text-body">{erro}</p>}

      <div className="flex flex-col mt-2">
        {carregando ? (
          <p className="text-blue-gray-400 flex items-center gap-2">
            <EventNote className="animate-pulse" /> Carregando consultas...
          </p>
        ) : tableData.length === 0 ? (
          <p className="text-blue-gray-400">
            Nenhum agendamento encontrado para esta especialidade.
          </p>
        ) : (
          <Table
            data={tableData}
            columns={COLUMNS}
            onRowClick={selecionarConsulta}
          />
        )}
      </div>
    </div>
  );
}

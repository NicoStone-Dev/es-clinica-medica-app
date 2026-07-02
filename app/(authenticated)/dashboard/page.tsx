"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  LibraryAdd,
  EventNote,
  Person,
  MedicalServices,
  CalendarMonth,
} from "@mui/icons-material";

import { TextInput } from "@/app/components/TextInput/TextInput";
import Table from "@/app/components/Table/Table";
import { Button } from "@/app/components/Button/Button";
import Modal from "@/app/components/Modal/Modal";
import { apiFetch, ApiError } from "@/app/lib/api";
import type { Especialidade, Page } from "@/app/lib/types";

// Tipagem baseada na estrutura de Consultas
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

export default function AppointmentListing() {
  const router = useRouter();

  const [consultas, setConsultas] = useState<ConsultaResumo[]>([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // Estados do Modal (preservando o comportamento da tela anterior)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [consultaSelecionada, setConsultaSelecionada] = useState<typeof tableData[0] | null>(null);

  async function carregarConsultas() {
    setCarregando(true);
    try {
      const pagina = await apiFetch<Page<ConsultaResumo>>("/consultas");
      setConsultas(pagina.content);
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : "Erro ao carregar as consultas.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarConsultas();
  }, []);

  // Filtra exatamente pela especialidade digitada (ignorando maiúsculas/minúsculas).
  // Se vazio, mostra todas as consultas.
  const consultasFiltradas =
    busca.trim() === ""
      ? consultas
      : consultas.filter(
          (c) => c.especialidade.toUpperCase() === busca.trim().toUpperCase()
        );

  // Formata os dados para a Tabela e nivela os objetos aninhados
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

  // Abre o Modal com os detalhes da consulta selecionada na tabela
  function handleRowClick(row: typeof tableData[0]) {
    setConsultaSelecionada(row);
    setIsModalOpen(true);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="gap-0">
        <h1 className="text-primary font-semibold text-body-emph">
          Agendamentos
        </h1>
        <p className="text-blue-gray-400 font-regular text-body">
          Pesquise consultas fornecendo a especialidade exata (ex: ORTOPEDIA, CARDIOLOGIA).
        </p>
      </div>

      <div className="flex flex-row justify-between">
        <TextInput
          leftIcon={<Search />}
          placeholder="Pesquisar por especialidade..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <Button
          rightIcon={<LibraryAdd />}
          onClick={() => {
            // Inicia o fluxo de agendamento que você já possui
            router.push("/appointment/patient_register");
          }}
        >
          Novo Agendamento
        </Button>
      </div>

      {erro && <p className="text-red-500 text-body">{erro}</p>}

      <div className="flex flex-col">
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
            onRowClick={handleRowClick}
          />
        )}
      </div>

      {/* Modal para Visualização Preservado */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Detalhes da Consulta"
      >
        {consultaSelecionada && (
          <div className="flex flex-col gap-6 m-xl mb-xs text-blue-gray-600 px-10">
            <div className="flex flex-row items-center gap-4">
              <EventNote />
              <p className="font-bold text-body-emph">Informações do Agendamento</p>
            </div>
            
            <div className="flex flex-col gap-4 pl-10 border-l-2 border-blue-gray-200 ml-2">
              <div className="flex items-center gap-2">
                <Person className="text-primary" />
                <span className="font-semibold w-32">Paciente:</span>
                <span>{consultaSelecionada.pacienteNome}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <MedicalServices className="text-primary" />
                <span className="font-semibold w-32">Médico:</span>
                <span>{consultaSelecionada.medicoNome}</span>
              </div>

              <div className="flex items-center gap-2">
                <EventNote className="text-primary" />
                <span className="font-semibold w-32">Especialidade:</span>
                <span>{consultaSelecionada.especialidade}</span>
              </div>

              <div className="flex items-center gap-2">
                <CalendarMonth className="text-primary" />
                <span className="font-semibold w-32">Data e Hora:</span>
                <span>{consultaSelecionada.dataHoraFormatada}</span>
              </div>
            </div>

            <div className="flex justify-end gap-md mt-4">
              <Button type="button" onClick={() => setIsModalOpen(false)}>
                Fechar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
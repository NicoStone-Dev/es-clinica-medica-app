"use client";

import { useEffect, useState } from "react";
import { Schedule, Person } from "@mui/icons-material";
import { apiFetch, ApiError } from "@/app/lib/api";
import type { ConsultaDetalhe } from "@/app/lib/types";

function formatarHora(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const HOJE = new Date().toLocaleDateString("pt-BR", {
  weekday: "long",
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export default function AgendaPage() {
  const [consultas, setConsultas] = useState<ConsultaDetalhe[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [semPermissao, setSemPermissao] = useState(false);

  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      try {
        const lista = await apiFetch<ConsultaDetalhe[]>(
          "/consultas/agenda-do-dia"
        );
        setConsultas(lista);
      } catch (e) {
        if (e instanceof ApiError && e.status === 403) {
          setSemPermissao(true);
        } else {
          setErro(
            e instanceof ApiError ? e.message : "Erro ao carregar a agenda."
          );
        }
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  return (
    <div className="flex flex-col gap-6 px-16 py-8">
      <div className="gap-0">
        <h1 className="text-primary font-semibold text-heading">
          Minha Agenda
        </h1>
        <p className="text-blue-gray-400 font-regular text-body capitalize">
          {HOJE}
        </p>
      </div>

      {semPermissao ? (
        <p className="text-blue-gray-400 text-body">
          Esta tela é exclusiva para médicos. Faça login com um usuário médico
          para ver a agenda do dia.
        </p>
      ) : carregando ? (
        <p className="text-blue-gray-400">Carregando agenda...</p>
      ) : erro ? (
        <p className="text-red-500 text-body">{erro}</p>
      ) : consultas.length === 0 ? (
        <p className="text-blue-gray-400 text-body">
          Nenhuma consulta agendada para hoje.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {consultas.map((consulta) => (
            <div
              key={consulta.id}
              className="flex flex-row items-center gap-6 rounded-[12px] border border-blue-gray-200 bg-white p-5"
            >
              <div className="flex flex-row items-center gap-2 text-primary font-semibold text-body-emph min-w-24">
                <Schedule />
                {formatarHora(consulta.dataHora)}
              </div>
              <div className="h-10 w-px bg-blue-gray-200" />
              <div className="flex flex-row items-center gap-3 text-blue-gray-600">
                <Person className="text-blue-gray-400" />
                <div className="flex flex-col">
                  <span className="text-small text-blue-gray-400">Paciente</span>
                  <span className="font-bold">{consulta.pacienteNome}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

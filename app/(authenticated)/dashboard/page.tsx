"use client";

import { useEffect, useState } from "react";
import { EventNote, MedicalServices, Groups, Search } from "@mui/icons-material";
import type { ReactNode } from "react";
import { TextInput } from "@/app/components/TextInput/TextInput";
import { StatusBadge } from "@/app/components/StatusBadge/StatusBadge";
import { apiFetch, ApiError } from "@/app/lib/api";
import type { ConsultaDetalhe, DashboardResumo, Page } from "@/app/lib/types";

function StatCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="flex flex-1 flex-row items-center gap-4 rounded-[12px] border border-blue-gray-200 bg-white p-6">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-primary">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-blue-gray-400 text-body">{label}</span>
        <span className="text-primary font-semibold text-heading">{value}</span>
      </div>
    </div>
  );
}

function formatarDataHora(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function DashboardPage() {
  const [dados, setDados] = useState<DashboardResumo | null>(null);
  const [consultas, setConsultas] = useState<ConsultaDetalhe[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [semPermissao, setSemPermissao] = useState(false);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      try {
        // O /consultas é paginado; pedimos um tamanho grande para trazer todas
        // e permitir a filtragem por especialidade no front.
        const [resumo, paginaConsultas] = await Promise.all([
          apiFetch<DashboardResumo>("/dashboard"),
          apiFetch<Page<ConsultaDetalhe>>("/consultas?size=1000"),
        ]);
        setDados(resumo);
        setConsultas(paginaConsultas.content);
      } catch (e) {
        if (e instanceof ApiError && e.status === 403) {
          setSemPermissao(true);
        } else {
          setErro(
            e instanceof ApiError ? e.message : "Erro ao carregar o dashboard."
          );
        }
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  const especialidades = dados
    ? Object.entries(dados.consultasPorEspecialidade)
    : [];

  const maxPorEspecialidade = especialidades.reduce(
    (max, [, total]) => Math.max(max, total),
    0
  );

  // A busca filtra as consultas pela especialidade (mesmo padrão de pesquisa
  // do fichamento de paciente). Vazia = mostra todas.
  const consultasFiltradas = consultas.filter((c) =>
    c.especialidade.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 px-16 py-8">
      <div className="gap-0">
        <h1 className="text-primary font-semibold text-heading">
          Painel de Controle
        </h1>
        <p className="text-blue-gray-400 font-regular text-body">
          Visão geral da clínica.
        </p>
      </div>

      {semPermissao ? (
        <p className="text-blue-gray-400 text-body">
          Apenas administradores têm acesso ao painel de controle.
        </p>
      ) : carregando ? (
        <p className="text-blue-gray-400">Carregando indicadores...</p>
      ) : erro ? (
        <p className="text-red-500 text-body">{erro}</p>
      ) : dados ? (
        <>
          <div className="flex flex-row flex-wrap gap-6">
            <StatCard
              icon={<EventNote />}
              label="Consultas agendadas"
              value={dados.totalConsultas}
            />
            <StatCard
              icon={<MedicalServices />}
              label="Médicos ativos"
              value={dados.totalMedicosAtivos}
            />
            <StatCard
              icon={<Groups />}
              label="Pacientes ativos"
              value={dados.totalPacientesAtivos}
            />
          </div>

          {/* Visão geral (agregado) por especialidade */}
          <div className="flex flex-col gap-4 rounded-[12px] border border-blue-gray-200 bg-white p-6">
            <h2 className="text-primary font-semibold text-body-emph">
              Consultas por especialidade
            </h2>
            {especialidades.length === 0 ? (
              <p className="text-blue-gray-400 text-body">
                Nenhuma consulta agendada ainda.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {especialidades.map(([especialidade, total]) => (
                  <div key={especialidade} className="flex flex-col gap-1">
                    <div className="flex flex-row justify-between text-blue-gray-600 text-body">
                      <span>{especialidade}</span>
                      <span className="font-semibold">{total}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-blue-100">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{
                          width: `${
                            maxPorEspecialidade > 0
                              ? (total / maxPorEspecialidade) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Detalhamento: tabela de consultas pesquisável por especialidade */}
          <div className="flex flex-col gap-4 rounded-[12px] border border-blue-gray-200 bg-white p-6">
            <div className="flex flex-row items-center justify-between gap-4">
              <h2 className="text-primary font-semibold text-body-emph">
                Consultas por especialidade — detalhamento
              </h2>
              <TextInput
                leftIcon={<Search />}
                placeholder="Pesquisar especialidade"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>

            {consultas.length === 0 ? (
              <p className="text-blue-gray-400 text-body">
                Nenhuma consulta agendada ainda.
              </p>
            ) : consultasFiltradas.length === 0 ? (
              <p className="text-blue-gray-400 text-body">
                Nenhuma consulta encontrada para “{busca}”.
              </p>
            ) : (
              <div className="w-full overflow-hidden rounded-[10px] border border-surface">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-blue-gray-200">
                      <th className="border-b border-surface px-4 py-3 text-[12px] font-semibold uppercase tracking-wide text-blue-gray-500">
                        Especialidade
                      </th>
                      <th className="border-b border-surface px-4 py-3 text-[12px] font-semibold uppercase tracking-wide text-blue-gray-500">
                        Paciente
                      </th>
                      <th className="border-b border-surface px-4 py-3 text-[12px] font-semibold uppercase tracking-wide text-blue-gray-500">
                        Médico
                      </th>
                      <th className="border-b border-surface px-4 py-3 text-[12px] font-semibold uppercase tracking-wide text-blue-gray-500">
                        Data/Hora
                      </th>
                      <th className="border-b border-surface px-4 py-3 text-[12px] font-semibold uppercase tracking-wide text-blue-gray-500">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {consultasFiltradas.map((c, i) => (
                      <tr
                        key={c.id}
                        className={`border-b border-surface ${
                          i % 2 === 0 ? "bg-surface-variant" : "bg-white"
                        }`}
                      >
                        <td className="px-4 py-3 text-[15px] font-semibold text-blue-gray-600">
                          {c.especialidade}
                        </td>
                        <td className="px-4 py-3 text-[15px] text-blue-gray-600">
                          {c.pacienteNome}
                        </td>
                        <td className="px-4 py-3 text-[15px] text-blue-gray-600">
                          {c.medicoNome}
                        </td>
                        <td className="px-4 py-3 text-[15px] text-blue-gray-600">
                          {formatarDataHora(c.dataHora)}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={c.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}

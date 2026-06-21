"use client";

import { useEffect, useState } from "react";
import { apiFetch, ApiError } from "../../lib/api";
import type { Page, MedicoResumo } from "../../lib/types";

// Esta página é um EXEMPLO de integração real: ela busca a lista de médicos
// ativos no backend (GET /medicos) e mostra na tela. Use o mesmo padrão
// (apiFetch + estados de carregando/erro) para montar as outras telas:
// listar pacientes, cadastrar paciente, agendar consulta, etc.
// Os tipos de cada endpoint estão em app/lib/types.ts.
export default function Appointment() {
  const [medicos, setMedicos] = useState<MedicoResumo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregarMedicos() {
      try {
        const pagina = await apiFetch<Page<MedicoResumo>>("/medicos");
        setMedicos(pagina.content);
      } catch (e) {
        if (e instanceof ApiError && e.status === 403) {
          setErro(
            "Seu usuário não tem permissão para ver a lista de médicos (esse endpoint é restrito a Administrador/Recepcionista)."
          );
        } else {
          setErro("Não foi possível carregar os médicos. Verifique se o backend está rodando.");
        }
      } finally {
        setCarregando(false);
      }
    }
    carregarMedicos();
  }, []);

  return (
    <div className="flex flex-col gap-4 p-8 h-full overflow-y-auto bg-[radial-gradient(45.07%_45.07%_at_50.09%_54.93%,_var(--color-blue-gray-200,#DCE9FF)_0%,_#FFF_100%)]">
      <h1 className="font-bold text-title text-primary">Médicos disponíveis</h1>

      {carregando && <p className="text-blue-gray-400">Carregando médicos...</p>}
      {erro && <p className="text-red-500">{erro}</p>}

      {!carregando && !erro && medicos.length === 0 && (
        <p className="text-blue-gray-400">Nenhum médico cadastrado ainda.</p>
      )}

      {!carregando && !erro && medicos.length > 0 && (
        <ul className="flex flex-col gap-3">
          {medicos.map((medico) => (
            <li key={medico.id} className="bg-white rounded-[10px] p-4 shadow">
              <p className="font-bold text-blue-gray-700">{medico.nome}</p>
              <p className="text-sm text-blue-gray-400">
                {medico.especialidade} · CRM {medico.crm}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

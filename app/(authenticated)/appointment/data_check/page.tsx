"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Person, MedicalServices, Event } from "@mui/icons-material";
import { Button } from "@/app/components/Button/Button";
import { apiFetch, ApiError } from "@/app/lib/api";
import type { ConsultaDetalhe, NovaConsulta } from "@/app/lib/types";
import { useAppointment } from "../AppointmentContext";

function formatarDataHora(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function DataCheck() {
  const router = useRouter();
  const { paciente, medico, dataHora, reset } = useAppointment();

  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [consulta, setConsulta] = useState<ConsultaDetalhe | null>(null);

  // Guard: precisa ter passado por todas as etapas anteriores.
  useEffect(() => {
    if (consulta) return; // já confirmou: não redireciona mesmo após o reset()
    if (!paciente) {
      router.replace("/appointment/patient_register");
    } else if (!medico) {
      router.replace("/appointment/available_professionals");
    } else if (!dataHora) {
      router.replace("/appointment/date_picker");
    }
  }, [paciente, medico, dataHora, consulta, router]);

  async function confirmar() {
    if (!paciente || !medico || !dataHora) return;
    setErro(null);
    setSalvando(true);
    try {
      const payload: NovaConsulta = {
        pacienteId: paciente.id,
        medicoId: medico.id,
        dataHora,
      };
      const criada = await apiFetch<ConsultaDetalhe>("/consultas", {
        method: "POST",
        body: payload,
      });
      setConsulta(criada);
      reset();
    } catch (e) {
      setErro(
        e instanceof ApiError ? e.message : "Erro ao agendar a consulta."
      );
    } finally {
      setSalvando(false);
    }
  }

  // Tela de sucesso após confirmar o agendamento.
  if (consulta) {
    return (
      <div className="flex flex-col items-center gap-6 px-6 py-10">
        <CheckCircle className="text-green-500" style={{ fontSize: 64 }} />
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-primary font-semibold text-body-emph">
            Consulta agendada com sucesso!
          </h1>
          <p className="text-blue-gray-400 text-body">
            {consulta.pacienteNome} com {consulta.medicoNome} em{" "}
            {formatarDataHora(consulta.dataHora)}.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => router.push("/appointment/patient_register")}
        >
          Nova consulta
        </Button>
      </div>
    );
  }

  if (!paciente || !medico || !dataHora) return null;

  return (
    <div className="flex flex-col gap-6 px-6">
      <div className="gap-0">
        <h1 className="text-primary font-semibold text-body-emph">
          Confirmação de Dados
        </h1>
        <p className="text-blue-gray-400 font-regular text-body">
          Revise as informações antes de confirmar o agendamento.
        </p>
      </div>

      <div className="flex flex-row gap-30 rounded-[12px] border border-blue-gray-200 items-center justify-center bg-white p-6 w-full">
        <div className="flex flex-row items-center gap-3 text-blue-gray-600">
          <Person className="text-primary" />
          <div className="flex flex-col">
            <span className="text-small text-blue-gray-400">Paciente</span>
            <span className="font-bold">{paciente.nome}</span>
            <span className="text-small text-blue-gray-400">
              CPF {paciente.cpf}
            </span>
          </div>
        </div>

        <div className="flex flex-row items-center gap-3 text-blue-gray-600">
          <MedicalServices className="text-primary" />
          <div className="flex flex-col">
            <span className="text-small text-blue-gray-400">Profissional</span>
            <span className="font-bold">{medico.nome}</span>
            <span className="text-small text-blue-gray-400">
              {medico.especialidade} — CRM {medico.crm}
            </span>
          </div>
        </div>

        <div className="flex flex-row items-center gap-3 text-blue-gray-600">
          <Event className="text-primary" />
          <div className="flex flex-col">
            <span className="text-small text-blue-gray-400">Data e horário</span>
            <span className="font-bold">{formatarDataHora(dataHora)}</span>
          </div>
        </div>
      </div>

      {erro && <p className="text-red-500 text-body">{erro}</p>}

      <div className="flex justify-between w-full">
        <Button
          variant="ghost"
          type="button"
          onClick={() => router.push("/appointment/date_picker")}
        >
          Voltar
        </Button>
        <Button type="button" onClick={confirmar} isLoading={salvando}>
          Confirmar agendamento
        </Button>
      </div>
    </div>
  );
}

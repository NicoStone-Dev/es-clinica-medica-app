"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/Button/Button";
import { useAppointment } from "../AppointmentContext";

// A clínica atende de segunda a sábado, das 07h às 18h (ver
// ValidarHorarioFuncionamento.java no backend). Como a última consulta precisa
// começar antes das 18h, oferecemos horários de hora em hora das 07h às 17h.
const HORARIOS = Array.from({ length: 11 }, (_, i) => {
  const hora = 7 + i; // 7..17
  return `${String(hora).padStart(2, "0")}:00`;
});

// Data mínima selecionável = hoje (formato yyyy-MM-dd para o input nativo).
function hojeISO() {
  const agora = new Date();
  const offset = agora.getTimezoneOffset();
  return new Date(agora.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

export default function DatePicker() {
  const router = useRouter();
  const { paciente, medico, dataHora, setDataHora } = useAppointment();

  const [data, setData] = useState(() => dataHora?.slice(0, 10) ?? "");
  const [hora, setHora] = useState(() => dataHora?.slice(11, 16) ?? "");
  const [erro, setErro] = useState<string | null>(null);

  // Guard: precisa de paciente e médico já escolhidos.
  useEffect(() => {
    if (!paciente) {
      router.replace("/appointment/patient_register");
    } else if (!medico) {
      router.replace("/appointment/available_professionals");
    }
  }, [paciente, medico, router]);

  const minData = useMemo(() => hojeISO(), []);

  function continuar() {
    setErro(null);

    if (!data || !hora) {
      setErro("Selecione a data e o horário da consulta.");
      return;
    }

    const dataHoraISO = `${data}T${hora}:00`;
    const quando = new Date(dataHoraISO);

    if (Number.isNaN(quando.getTime())) {
      setErro("Data ou horário inválido.");
      return;
    }
    if (quando.getDay() === 0) {
      setErro("A clínica não atende aos domingos.");
      return;
    }
    if (quando.getTime() <= Date.now()) {
      setErro("Escolha uma data e horário no futuro.");
      return;
    }

    setDataHora(dataHoraISO);
    router.push("/appointment/data_check");
  }

  if (!paciente || !medico) return null;

  return (
    <div className="flex flex-col gap-6 px-6">
      <div className="gap-0">
        <h1 className="text-primary font-semibold text-body-emph">
          Marcação de Consulta
        </h1>
        <p className="text-blue-gray-400 font-regular text-body">
          Atendimento com <span className="font-bold">{medico.nome}</span> (
          {medico.especialidade}). A clínica atende de segunda a sábado, das 07h
          às 18h.
        </p>
      </div>

      <div className="flex flex-col gap-2 max-w-xs">
        <label className="text-blue-gray-600 font-medium">Data</label>
        <input
          type="date"
          value={data}
          min={minData}
          onChange={(e) => setData(e.target.value)}
          className="rounded-[10px] border border-blue-gray-200 bg-white px-4 py-3 text-blue-gray-600 outline-none focus:border-primary"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-blue-gray-600 font-medium">Horário</label>
        <div className="flex flex-row flex-wrap gap-3">
          {HORARIOS.map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => setHora(h)}
              className={`rounded-[10px] px-4 py-2 font-medium transition-colors ${
                hora === h
                  ? "bg-primary text-blue-gray-100"
                  : "bg-blue-100 text-blue-gray-600 hover:bg-surface"
              }`}
            >
              {h}
            </button>
          ))}
        </div>
      </div>

      {erro && <p className="text-red-500 text-body">{erro}</p>}

      <div className="flex justify-between">
        <Button
          variant="ghost"
          type="button"
          onClick={() => router.push("/appointment/available_professionals")}
        >
          Voltar
        </Button>
        <Button type="button" onClick={continuar}>
          Continuar
        </Button>
      </div>
    </div>
  );
}


"use client";


import { useEffect, useState } from "react";

import {

EventNote,

MedicalServices,

Groups,

} from "@mui/icons-material";

import type { ReactNode } from "react";

import { apiFetch, ApiError } from "@/app/lib/api";

import type { DashboardResumo } from "@/app/lib/types";


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


export default function DashboardPage() {

const [dados, setDados] = useState<DashboardResumo | null>(null);

const [carregando, setCarregando] = useState(true);

const [erro, setErro] = useState<string | null>(null);

const [semPermissao, setSemPermissao] = useState(false);


useEffect(() => {

async function carregar() {

setCarregando(true);

try {

const resumo = await apiFetch<DashboardResumo>("/dashboard");

setDados(resumo);

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

</>

) : null}

</div>

);

} 
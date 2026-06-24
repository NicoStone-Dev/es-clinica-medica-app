"use client";

import { useEffect, useState } from "react";
import {
  Search,
  PersonAddAlt1,
  Person,
  Email,
  Phone,
  Badge,
  MedicalServices,
} from "@mui/icons-material";
import { TextInput } from "@/app/components/TextInput/TextInput";
import Table from "@/app/components/Table/Table";
import { Button } from "@/app/components/Button/Button";
import Modal from "@/app/components/Modal/Modal";
import { EnderecoForm } from "@/app/components/EnderecoForm/EnderecoForm";
import { apiFetch, ApiError } from "@/app/lib/api";
import type {
  Endereco,
  Especialidade,
  MedicoResumo,
  MedicoDetalhe,
  NovoMedico,
  AtualizacaoMedico,
  Page,
} from "@/app/lib/types";

const COLUMNS = [
  { key: "nome" as const, label: "Nome" },
  { key: "especialidade" as const, label: "Especialidade" },
  { key: "crm" as const, label: "CRM" },
  { key: "email" as const, label: "Email" },
];

const ESPECIALIDADES: Especialidade[] = [
  "ORTOPEDIA",
  "CARDIOLOGIA",
  "GINECOLOGIA",
  "DERMATOLOGIA",
];

const ENDERECO_INICIAL: Endereco = {
  rua: "",
  numero: "",
  bairro: "",
  cep: "",
  cidade: "",
  uf: "",
  complemento: "",
};

const CADASTRO_INICIAL: NovoMedico = {
  nome: "",
  email: "",
  senha: "",
  telefone: "",
  crm: "",
  especialidade: "ORTOPEDIA",
  endereco: ENDERECO_INICIAL,
};

// O backend espera o CEP só com os 8 dígitos, sem hífen.
function limparEndereco(endereco: Endereco): Endereco {
  return { ...endereco, cep: endereco.cep.replace(/\D/g, "") };
}

function EspecialidadeSelect({
  value,
  onChange,
}: {
  value: Especialidade;
  onChange: (v: Especialidade) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as Especialidade)}
      className="flex h-[52px] w-[350px] items-center rounded-[10px] border-[1.5px] border-surface bg-surface-variant px-[14px] text-[15px] text-blue-gray-600 outline-none focus:border-primary"
    >
      {ESPECIALIDADES.map((e) => (
        <option key={e} value={e}>
          {e}
        </option>
      ))}
    </select>
  );
}

export default function Management() {
  const [medicos, setMedicos] = useState<MedicoResumo[]>([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // --- Cadastro ---
  const [cadastroAberto, setCadastroAberto] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erroCadastro, setErroCadastro] = useState<string | null>(null);
  const [cadastro, setCadastro] = useState<NovoMedico>(CADASTRO_INICIAL);

  // --- Edição ---
  const [edicao, setEdicao] = useState<MedicoDetalhe | null>(null);
  const [salvandoEdicao, setSalvandoEdicao] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [erroEdicao, setErroEdicao] = useState<string | null>(null);

  async function carregarMedicos() {
    setCarregando(true);
    try {
      const pagina = await apiFetch<Page<MedicoResumo>>("/medicos");
      setMedicos(pagina.content);
    } catch (e) {
      setErro(
        e instanceof ApiError ? e.message : "Erro ao carregar médicos."
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarMedicos();
  }, []);

  // ---------- Cadastro ----------
  function abrirCadastro() {
    setErroCadastro(null);
    setCadastro(CADASTRO_INICIAL);
    setCadastroAberto(true);
  }

  function atualizarCadastro(
    campo: keyof Omit<NovoMedico, "endereco">,
    valor: string
  ) {
    setCadastro((prev) => ({ ...prev, [campo]: valor }));
  }

  function atualizarEnderecoCadastro(campo: keyof Endereco, valor: string) {
    setCadastro((prev) => ({
      ...prev,
      endereco: { ...prev.endereco, [campo]: valor },
    }));
  }

  async function salvarCadastro() {
    setErroCadastro(null);
    setSalvando(true);
    try {
      const payload: NovoMedico = {
        ...cadastro,
        endereco: limparEndereco(cadastro.endereco),
      };
      await apiFetch("/medicos", { method: "POST", body: payload });
      setCadastroAberto(false);
      await carregarMedicos();
    } catch (e) {
      setErroCadastro(
        e instanceof ApiError ? e.message : "Erro ao cadastrar médico."
      );
    } finally {
      setSalvando(false);
    }
  }

  // ---------- Edição ----------
  async function abrirEdicao(medico: MedicoResumo) {
    setErroEdicao(null);
    try {
      // Buscamos o detalhe para preencher o endereço (a listagem não o traz).
      const detalhe = await apiFetch<MedicoDetalhe>(`/medicos/${medico.id}`);
      setEdicao({
        ...detalhe,
        endereco: { ...ENDERECO_INICIAL, ...detalhe.endereco },
      });
    } catch (e) {
      setErro(
        e instanceof ApiError ? e.message : "Erro ao carregar dados do médico."
      );
    }
  }

  function atualizarEdicao(
    campo: "nome" | "email" | "telefone",
    valor: string
  ) {
    setEdicao((prev) => (prev ? { ...prev, [campo]: valor } : prev));
  }

  function atualizarEnderecoEdicao(campo: keyof Endereco, valor: string) {
    setEdicao((prev) =>
      prev ? { ...prev, endereco: { ...prev.endereco, [campo]: valor } } : prev
    );
  }

  async function salvarEdicao() {
    if (!edicao) return;
    setErroEdicao(null);
    setSalvandoEdicao(true);
    try {
      const payload: AtualizacaoMedico = {
        id: edicao.id,
        nome: edicao.nome,
        email: edicao.email,
        telefone: edicao.telefone,
        endereco: limparEndereco(edicao.endereco),
      };
      await apiFetch("/medicos", { method: "PUT", body: payload });
      setEdicao(null);
      await carregarMedicos();
    } catch (e) {
      setErroEdicao(
        e instanceof ApiError ? e.message : "Erro ao atualizar médico."
      );
    } finally {
      setSalvandoEdicao(false);
    }
  }

  async function inativarMedico() {
    if (!edicao) return;
    setErroEdicao(null);
    setExcluindo(true);
    try {
      await apiFetch(`/medicos/${edicao.id}`, { method: "DELETE" });
      setEdicao(null);
      await carregarMedicos();
    } catch (e) {
      setErroEdicao(
        e instanceof ApiError ? e.message : "Erro ao inativar médico."
      );
    } finally {
      setExcluindo(false);
    }
  }

  const medicosFiltrados = medicos.filter((m) =>
    m.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4 px-16 py-8">
      <div className="gap-0">
        <h1 className="text-primary font-semibold text-heading">
          Gerenciamento de Médicos
        </h1>
        <p className="text-blue-gray-400 font-regular text-body">
          Cadastre, edite e inative os profissionais da clínica.
        </p>
      </div>

      <div className="flex flex-row justify-between">
        <TextInput
          leftIcon={<Search />}
          placeholder="Pesquisar Médico"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <Button rightIcon={<PersonAddAlt1 />} onClick={abrirCadastro}>
          Cadastrar Novo Médico
        </Button>
      </div>

      {erro && <p className="text-red-500 text-body">{erro}</p>}

      <div className="flex flex-col">
        {carregando ? (
          <p className="text-blue-gray-400">Carregando médicos...</p>
        ) : medicosFiltrados.length === 0 ? (
          <p className="text-blue-gray-400">Nenhum médico cadastrado.</p>
        ) : (
          <Table
            data={medicosFiltrados}
            columns={COLUMNS}
            onRowClick={abrirEdicao}
          />
        )}
      </div>

      {/* ---------- Modal de cadastro ---------- */}
      <Modal
        isOpen={cadastroAberto}
        onClose={() => setCadastroAberto(false)}
        title="Cadastrar Novo Médico"
      >
        <div className="flex flex-row bg-transparent justify-between text-blue-gray-600 gap-12 m-xl mb-xs">
          {/* Coluna 1: dados profissionais */}
          <div className="flex flex-col w-full gap-5 border-r px-10 border-blue-gray-200">
            <div className="flex flex-row items-center gap-4">
              <Person />
              <p className="font-bold text-body-emph"> Dados do Profissional</p>
            </div>
            <div className="flex flex-col w-full justify-center">
              <p>Nome Completo</p>
              <TextInput
                leftIcon={<Person />}
                placeholder="Nome Completo"
                type="text"
                value={cadastro.nome}
                onChange={(e) => atualizarCadastro("nome", e.target.value)}
              />
            </div>
            <div className="flex flex-col w-full justify-center">
              <p>CRM</p>
              <TextInput
                leftIcon={<Badge />}
                placeholder="123456/SP"
                type="text"
                value={cadastro.crm}
                onChange={(e) => atualizarCadastro("crm", e.target.value)}
              />
            </div>
            <div className="flex flex-col w-full justify-center">
              <p>Especialidade</p>
              <EspecialidadeSelect
                value={cadastro.especialidade}
                onChange={(v) =>
                  setCadastro((prev) => ({ ...prev, especialidade: v }))
                }
              />
            </div>
            <div className="flex flex-col w-full justify-center">
              <p>Telefone</p>
              <TextInput
                leftIcon={<Phone />}
                placeholder="(99) 9 9999-9999"
                type="tel"
                inputMode="numeric"
                maxLength={11}
                value={cadastro.telefone}
                onChange={(e) =>
                  atualizarCadastro("telefone", e.target.value.replace(/\D/g, ""))
                }
              />
            </div>
            <div className="flex flex-col w-full justify-center">
              <p>Email (login de acesso)</p>
              <TextInput
                leftIcon={<Email />}
                placeholder="medico@clinica.com"
                type="email"
                value={cadastro.email}
                onChange={(e) => atualizarCadastro("email", e.target.value)}
              />
            </div>
            <div className="flex flex-col w-full justify-center">
              <p>Senha de acesso</p>
              <TextInput
                leftIcon={<MedicalServices />}
                placeholder="Senha inicial do médico"
                type="password"
                value={cadastro.senha}
                onChange={(e) => atualizarCadastro("senha", e.target.value)}
              />
            </div>
          </div>

          {/* Coluna 2: endereço */}
          <div className="pr-10">
            <EnderecoForm
              value={cadastro.endereco}
              onChange={atualizarEnderecoCadastro}
            />
          </div>
        </div>
        {erroCadastro && (
          <p className="text-red-500 text-body px-10">{erroCadastro}</p>
        )}
        <div className="flex justify-end gap-md w-full px-10">
          <Button type="button" onClick={salvarCadastro} isLoading={salvando}>
            Cadastrar
          </Button>
        </div>
      </Modal>

      {/* ---------- Modal de edição ---------- */}
      <Modal
        isOpen={edicao !== null}
        onClose={() => setEdicao(null)}
        title="Editar Médico"
      >
        {edicao && (
          <>
            <div className="flex flex-row bg-transparent justify-between text-blue-gray-600 gap-12 m-xl mb-xs">
              <div className="flex flex-col w-full gap-5 border-r px-10 border-blue-gray-200">
                <div className="flex flex-row items-center gap-4">
                  <Person />
                  <p className="font-bold text-body-emph"> Dados do Profissional</p>
                </div>
                <div className="flex flex-col w-full justify-center">
                  <p>Nome Completo</p>
                  <TextInput
                    leftIcon={<Person />}
                    type="text"
                    value={edicao.nome}
                    onChange={(e) => atualizarEdicao("nome", e.target.value)}
                  />
                </div>
                {/* CRM e especialidade não são editáveis pelo backend (PUT /medicos) */}
                <div className="flex flex-col w-full justify-center">
                  <p>CRM (não editável)</p>
                  <TextInput
                    leftIcon={<Badge />}
                    type="text"
                    value={edicao.crm}
                    disabled
                  />
                </div>
                <div className="flex flex-col w-full justify-center">
                  <p>Especialidade (não editável)</p>
                  <TextInput
                    leftIcon={<MedicalServices />}
                    type="text"
                    value={edicao.especialidade}
                    disabled
                  />
                </div>
                <div className="flex flex-col w-full justify-center">
                  <p>Telefone</p>
                  <TextInput
                    leftIcon={<Phone />}
                    type="tel"
                    inputMode="numeric"
                    maxLength={11}
                    value={edicao.telefone}
                    onChange={(e) =>
                      atualizarEdicao("telefone", e.target.value.replace(/\D/g, ""))
                    }
                  />
                </div>
                <div className="flex flex-col w-full justify-center">
                  <p>Email</p>
                  <TextInput
                    leftIcon={<Email />}
                    type="email"
                    value={edicao.email}
                    onChange={(e) => atualizarEdicao("email", e.target.value)}
                  />
                </div>
              </div>

              <div className="pr-10">
                <EnderecoForm
                  value={edicao.endereco}
                  onChange={atualizarEnderecoEdicao}
                />
              </div>
            </div>
            {erroEdicao && (
              <p className="text-red-500 text-body px-10">{erroEdicao}</p>
            )}
            <div className="flex justify-between gap-md w-full px-10">
              <Button
                type="button"
                variant="ghost"
                onClick={inativarMedico}
                isLoading={excluindo}
                className="text-red-500"
              >
                Inativar médico
              </Button>
              <Button
                type="button"
                onClick={salvarEdicao}
                isLoading={salvandoEdicao}
              >
                Salvar alterações
              </Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

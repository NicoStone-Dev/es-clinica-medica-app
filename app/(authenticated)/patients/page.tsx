"use client";

import { useEffect, useState } from "react";
import { Search, LibraryAdd, Person, Email, Phone } from "@mui/icons-material";
import { TextInput } from "@/app/components/TextInput/TextInput";
import Table from "@/app/components/Table/Table";
import { Button } from "@/app/components/Button/Button";
import Modal from "@/app/components/Modal/Modal";
import { EnderecoForm } from "@/app/components/EnderecoForm/EnderecoForm";
import { apiFetch, ApiError } from "@/app/lib/api";
import type {
  Endereco,
  PacienteResumo,
  PacienteDetalhe,
  NovoPaciente,
  AtualizacaoPaciente,
  Page,
} from "@/app/lib/types";

const COLUMNS = [
  { key: "nome" as const, label: "Nome" },
  { key: "cpf" as const, label: "CPF" },
  { key: "email" as const, label: "Email" },
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

const CADASTRO_INICIAL: NovoPaciente = {
  nome: "",
  email: "",
  telefone: "",
  cpf: "",
  endereco: ENDERECO_INICIAL,
};

// O backend espera o CEP só com os 8 dígitos, sem hífen.
function limparEndereco(endereco: Endereco): Endereco {
  return { ...endereco, cep: endereco.cep.replace(/\D/g, "") };
}

// O GET /pacientes/{id} não devolve o id; guardamos junto o id vindo da listagem.
type PacienteEmEdicao = PacienteDetalhe & { id: number };

export default function PatientsPage() {
  const [pacientes, setPacientes] = useState<PacienteResumo[]>([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // --- Cadastro ---
  const [cadastroAberto, setCadastroAberto] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erroCadastro, setErroCadastro] = useState<string | null>(null);
  const [cadastro, setCadastro] = useState<NovoPaciente>(CADASTRO_INICIAL);

  // --- Edição ---
  const [edicao, setEdicao] = useState<PacienteEmEdicao | null>(null);
  const [salvandoEdicao, setSalvandoEdicao] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [erroEdicao, setErroEdicao] = useState<string | null>(null);

  async function carregarPacientes() {
    setCarregando(true);
    try {
      const pagina = await apiFetch<Page<PacienteResumo>>("/pacientes");
      setPacientes(pagina.content);
    } catch (e) {
      setErro(
        e instanceof ApiError ? e.message : "Erro ao carregar pacientes."
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarPacientes();
  }, []);

  // ---------- Cadastro ----------
  function abrirCadastro() {
    setErroCadastro(null);
    setCadastro(CADASTRO_INICIAL);
    setCadastroAberto(true);
  }

  function atualizarCadastro(
    campo: keyof Omit<NovoPaciente, "endereco">,
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
      const payload: NovoPaciente = {
        ...cadastro,
        endereco: limparEndereco(cadastro.endereco),
      };
      await apiFetch("/pacientes", { method: "POST", body: payload });
      setCadastroAberto(false);
      await carregarPacientes();
    } catch (e) {
      setErroCadastro(
        e instanceof ApiError ? e.message : "Erro ao cadastrar paciente."
      );
    } finally {
      setSalvando(false);
    }
  }

  // ---------- Edição ----------
  async function abrirEdicao(paciente: PacienteResumo) {
    setErroEdicao(null);
    try {
      // A listagem não traz telefone/endereço; buscamos o detalhe completo.
      const detalhe = await apiFetch<PacienteDetalhe>(
        `/pacientes/${paciente.id}`
      );
      setEdicao({
        ...detalhe,
        id: paciente.id,
        endereco: { ...ENDERECO_INICIAL, ...detalhe.endereco },
      });
    } catch (e) {
      setErro(
        e instanceof ApiError
          ? e.message
          : "Erro ao carregar dados do paciente."
      );
    }
  }

  function atualizarEdicao(campo: "nome" | "email" | "telefone", valor: string) {
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
      const payload: AtualizacaoPaciente = {
        id: edicao.id,
        nome: edicao.nome,
        email: edicao.email,
        telefone: edicao.telefone,
        endereco: limparEndereco(edicao.endereco),
      };
      await apiFetch("/pacientes", { method: "PUT", body: payload });
      setEdicao(null);
      await carregarPacientes();
    } catch (e) {
      setErroEdicao(
        e instanceof ApiError ? e.message : "Erro ao atualizar paciente."
      );
    } finally {
      setSalvandoEdicao(false);
    }
  }

  async function inativarPaciente() {
    if (!edicao) return;
    setErroEdicao(null);
    setExcluindo(true);
    try {
      await apiFetch(`/pacientes/${edicao.id}`, { method: "DELETE" });
      setEdicao(null);
      await carregarPacientes();
    } catch (e) {
      setErroEdicao(
        e instanceof ApiError ? e.message : "Erro ao inativar paciente."
      );
    } finally {
      setExcluindo(false);
    }
  }

  const pacientesFiltrados = pacientes.filter((p) =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4 px-16 py-8">
      <div className="gap-0">
        <h1 className="text-primary font-semibold text-heading">
          Gerenciamento de Pacientes
        </h1>
        <p className="text-blue-gray-400 font-regular text-body">
          Cadastre, edite e inative os pacientes da clínica.
        </p>
      </div>

      <div className="flex flex-row justify-between">
        <TextInput
          leftIcon={<Search />}
          placeholder="Pesquisar Paciente"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <Button rightIcon={<LibraryAdd />} onClick={abrirCadastro}>
          Cadastrar Novo Paciente
        </Button>
      </div>

      {erro && <p className="text-red-500 text-body">{erro}</p>}

      <div className="flex flex-col">
        {carregando ? (
          <p className="text-blue-gray-400">Carregando pacientes...</p>
        ) : pacientesFiltrados.length === 0 ? (
          <p className="text-blue-gray-400">Nenhum paciente cadastrado.</p>
        ) : (
          <Table
            data={pacientesFiltrados}
            columns={COLUMNS}
            onRowClick={abrirEdicao}
          />
        )}
      </div>

      {/* ---------- Modal de cadastro ---------- */}
      <Modal
        isOpen={cadastroAberto}
        onClose={() => setCadastroAberto(false)}
        title="Cadastrar Novo Paciente"
      >
        <div className="flex flex-row bg-transparent justify-between text-blue-gray-600 gap-12 m-xl mb-xs">
          {/* Coluna 1: dados pessoais */}
          <div className="flex flex-col w-full gap-5 border-r px-10 border-blue-gray-200">
            <div className="flex flex-row items-center gap-4">
              <Person />
              <p className="font-bold text-body-emph"> Informações Pessoais</p>
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
              <p>CPF</p>
              <TextInput
                leftIcon={<Person />}
                placeholder="12345678901"
                inputMode="numeric"
                maxLength={11}
                value={cadastro.cpf}
                onChange={(e) =>
                  atualizarCadastro("cpf", e.target.value.replace(/\D/g, ""))
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
              <p>Email</p>
              <TextInput
                leftIcon={<Email />}
                placeholder="paciente@email.com"
                type="email"
                value={cadastro.email}
                onChange={(e) => atualizarCadastro("email", e.target.value)}
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
        title="Editar Paciente"
      >
        {edicao && (
          <>
            <div className="flex flex-row bg-transparent justify-between text-blue-gray-600 gap-12 m-xl mb-xs">
              <div className="flex flex-col w-full gap-5 border-r px-10 border-blue-gray-200">
                <div className="flex flex-row items-center gap-4">
                  <Person />
                  <p className="font-bold text-body-emph"> Informações Pessoais</p>
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
                {/* CPF não é editável pelo backend (PUT /pacientes) */}
                <div className="flex flex-col w-full justify-center">
                  <p>CPF (não editável)</p>
                  <TextInput
                    leftIcon={<Person />}
                    type="text"
                    value={edicao.cpf}
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
                onClick={inativarPaciente}
                isLoading={excluindo}
                className="text-red-500"
              >
                Inativar paciente
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

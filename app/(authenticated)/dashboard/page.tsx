"use client";

import { TextInput } from "@/app/components/TextInput/TextInput";

import Table from "@/app/components/Table/Table";

import { Button } from "@/app/components/Button/Button";

import {
  Search,
  LibraryAdd,
  Person,
  Email,
  Phone,
  Home,
} from "@mui/icons-material";

import Modal from "@/app/components/Modal/Modal";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { apiFetch, ApiError } from "@/app/lib/api";

import type { NovoPaciente, PacienteResumo, Page } from "@/app/lib/types";

import { useAppointment } from "../AppointmentContext";

const COLUMNS = [
  { key: "nome" as const, label: "Nome" },

  { key: "cpf" as const, label: "CPF" },

  { key: "email" as const, label: "Email" },
];

const FORM_INICIAL: NovoPaciente = {
  nome: "",

  email: "",

  telefone: "",

  cpf: "",

  endereco: {
    rua: "",

    numero: "",

    bairro: "",

    cep: "",

    cidade: "",

    uf: "",

    complemento: "",
  },
};

export default function PatientRegister() {
  const router = useRouter();

  const { setPaciente } = useAppointment();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Selecionar um paciente da lista é o passo 1 do fluxo de agendamento:

  // guarda o paciente no contexto e avança para a seleção do profissional.

  function selecionarPaciente(paciente: PacienteResumo) {
    setPaciente(paciente);

    router.push("/appointment/available_professionals");
  }

  const [pacientes, setPacientes] = useState<PacienteResumo[]>([]);

  const [busca, setBusca] = useState("");

  const [carregando, setCarregando] = useState(true);

  const [salvando, setSalvando] = useState(false);

  const [erro, setErro] = useState<string | null>(null);

  const [form, setForm] = useState<NovoPaciente>(FORM_INICIAL);

  async function carregarPacientes() {
    setCarregando(true);

    try {
      const pagina = await apiFetch<Page<PacienteResumo>>("/pacientes");

      setPacientes(pagina.content);
    } catch (e) {
      setErro(
        e instanceof ApiError ? e.message : "Erro ao carregar pacientes.",
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarPacientes();
  }, []);

  function atualizarCampo(
    campo: keyof Omit<NovoPaciente, "endereco">,
    valor: string,
  ) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  function atualizarEndereco(
    campo: keyof NovoPaciente["endereco"],
    valor: string,
  ) {
    setForm((prev) => ({
      ...prev,
      endereco: { ...prev.endereco, [campo]: valor },
    }));
  }

  async function handleSalvar() {
    setErro(null);

    setSalvando(true);

    try {
      const payload: NovoPaciente = {
        ...form,

        endereco: {
          ...form.endereco,

          cep: form.endereco.cep.replace(/\D/g, ""), // backend espera só os 8 dígitos, sem hífen
        },
      };

      await apiFetch("/pacientes", { method: "POST", body: payload });

      setIsModalOpen(false);

      setForm(FORM_INICIAL);

      await carregarPacientes();
    } catch (e) {
      setErro(
        e instanceof ApiError ? e.message : "Erro ao cadastrar paciente.",
      );
    } finally {
      setSalvando(false);
    }
  }

  const pacientesFiltrados = pacientes.filter((p) =>
    p.nome.toLowerCase().includes(busca.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="gap-0">
        <h1 className="text-primary font-semibold text-body-emph">
          Realizando Fichamento do Paciente
        </h1>

        <p className="text-blue-gray-400 font-regular text-body">
          Insira o paciente a ser atendido
        </p>
      </div>

      <div className=" flex flex-row justify-between">
        <TextInput
          leftIcon={<Search />}
          placeholder="Pesquisar Paciente"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />

        <Button
          rightIcon={<LibraryAdd />}
          onClick={() => {
            setErro(null);

            setForm(FORM_INICIAL);

            setIsModalOpen(true);
          }}
        >
          Fichar Novo Paciente
        </Button>
      </div>

      {erro && !isModalOpen && <p className="text-red-500 text-body">{erro}</p>}

      <div className="flex flex-col ">
        {carregando ? (
          <p className="text-blue-gray-400">Carregando pacientes...</p>
        ) : (
          <Table
            data={pacientesFiltrados}
            columns={COLUMNS}
            onRowClick={selecionarPaciente}
          />
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Fichar Novo Paciente"
      >
        <div className="flex flex-row bg-transparent justify-between text-blue-gray-600 gap-12 m-xl mb-xs">
          {/* form colum 1 */}

          {/* nome, email, telefone, cpf */}

          <div className="flex flex-col w-full gap-5 border-r px-10 border-blue-gray-200 ">
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
                value={form.nome}
                onChange={(e) => atualizarCampo("nome", e.target.value)}
              />
            </div>

            <div className="flex flex-col w-full justify-center">
              <p>CPF</p>

              <TextInput
                leftIcon={<Person />}
                placeholder="123.456.789-01"
                inputMode="numeric"
                pattern="[0-9]{11}"
                maxLength={11}
                value={form.cpf}
                onChange={(e) =>
                  atualizarCampo("cpf", e.target.value.replace(/\D/g, ""))
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
                pattern="[0-9]{11}"
                maxLength={11}
                value={form.telefone}
                onChange={(e) =>
                  atualizarCampo("telefone", e.target.value.replace(/\D/g, ""))
                }
              />
            </div>

            <div className="flex flex-col w-full justify-center">
              <p>Email</p>

              <TextInput
                leftIcon={<Email />}
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={(e) => atualizarCampo("email", e.target.value)}
              />
            </div>
          </div>

          {/* form colum 2 */}

          <div className="flex flex-col w-full pr-10 gap-5">
            <div className="flex flex-row items-center gap-4">
              <Home />

              <p className="font-bold text-body-emph"> Endereço</p>
            </div>

            {/* Cidade + UF */}

            <div className="flex flex-row gap-4">
              <div className="flex flex-col w-full justify-center">
                <p>Cidade</p>

                <TextInput
                  placeholder="Ex: São Paulo"
                  type="text"
                  value={form.endereco.cidade}
                  onChange={(e) => atualizarEndereco("cidade", e.target.value)}
                />
              </div>

              <div className="flex flex-col w-full justify-center">
                <p>UF</p>

                <TextInput
                  placeholder="SP"
                  type="text"
                  maxLength={2}
                  value={form.endereco.uf}
                  onChange={(e) =>
                    atualizarEndereco(
                      "uf",

                      e.target.value
                        .replace(/[^a-zA-Z]/g, "")
                        .toUpperCase()
                        .slice(0, 2),
                    )
                  }
                  className="uppercase"
                />
              </div>
            </div>

            {/* Rua + Casa */}

            <div className="flex flex-row gap-4">
              <div className="flex flex-col w-full justify-center">
                <p>Rua</p>

                <TextInput
                  placeholder="Ex: Av. Paulista"
                  type="text"
                  value={form.endereco.rua}
                  onChange={(e) => atualizarEndereco("rua", e.target.value)}
                />
              </div>

              <div className="flex flex-col w-full justify-center">
                <p>Casa</p>

                <TextInput
                  placeholder="Número"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={form.endereco.numero}
                  onChange={(e) =>
                    atualizarEndereco(
                      "numero",
                      e.target.value.replace(/\D/g, ""),
                    )
                  }
                />
              </div>
            </div>

            {/* CEP + Bairro */}

            <div className="flex flex-row gap-4">
              <div className="flex flex-col w-full justify-center">
                <p>CEP</p>

                <TextInput
                  placeholder="00000-000"
                  type="text"
                  inputMode="numeric"
                  maxLength={9}
                  value={form.endereco.cep}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, "");

                    const formatted =
                      raw.length > 5
                        ? `${raw.slice(0, 5)}-${raw.slice(5, 8)}`
                        : raw;

                    atualizarEndereco("cep", formatted);
                  }}
                />
              </div>

              <div className="flex flex-col w-full justify-center">
                <p>Bairro</p>

                <TextInput
                  placeholder="Ex: Centro"
                  type="text"
                  value={form.endereco.bairro}
                  onChange={(e) => atualizarEndereco("bairro", e.target.value)}
                />
              </div>
            </div>

            {/* Complemento */}

            <div className="flex flex-col w-full justify-center">
              <p>Complemento</p>

              <TextInput
                placeholder="Apto, bloco, etc."
                type="text"
                value={form.endereco.complemento}
                onChange={(e) =>
                  atualizarEndereco("complemento", e.target.value)
                }
              />
            </div>
          </div>
        </div>

        {erro && <p className="text-red-500 text-body px-10">{erro}</p>}

        <div className="flex justify-end gap-md">
          <Button type="button" onClick={handleSalvar} isLoading={salvando}>
            Salvar
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default Dashboard;

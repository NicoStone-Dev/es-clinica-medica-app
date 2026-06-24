"use client";

import { useState } from "react";
import { Person, Lock, CheckCircle, Badge } from "@mui/icons-material";
import { TextInput } from "@/app/components/TextInput/TextInput";
import { Button } from "@/app/components/Button/Button";
import { apiFetch, ApiError } from "@/app/lib/api";
import type { NovoUsuario, UsuarioDetalhe, Papel } from "@/app/lib/types";

// O papel MEDICO não entra aqui: usuários médicos são criados automaticamente
// ao cadastrar o médico em /management (POST /medicos).
const PAPEIS: { valor: Papel; rotulo: string }[] = [
  { valor: "RECEPCIONISTA", rotulo: "Recepcionista" },
  { valor: "ADMINISTRADOR", rotulo: "Administrador" },
];

const FORM_INICIAL: NovoUsuario = {
  login: "",
  senha: "",
  papel: "RECEPCIONISTA",
};

export default function UsersPage() {
  const [form, setForm] = useState<NovoUsuario>(FORM_INICIAL);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [criado, setCriado] = useState<UsuarioDetalhe | null>(null);

  function atualizar(campo: keyof NovoUsuario, valor: string) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  async function salvar() {
    setErro(null);
    setSalvando(true);
    try {
      const usuario = await apiFetch<UsuarioDetalhe>("/usuarios", {
        method: "POST",
        body: form,
      });
      setCriado(usuario);
      setForm(FORM_INICIAL);
    } catch (e) {
      if (e instanceof ApiError && e.status === 403) {
        setErro("Apenas administradores podem cadastrar usuários.");
      } else {
        setErro(
          e instanceof ApiError ? e.message : "Erro ao cadastrar usuário."
        );
      }
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 px-16 py-8">
      <div className="gap-0">
        <h1 className="text-primary font-semibold text-heading">
          Cadastro de Usuários
        </h1>
        <p className="text-blue-gray-400 font-regular text-body">
          Crie usuários de acesso ao sistema (recepcionistas e administradores).
        </p>
      </div>

      {criado && (
        <div className="flex flex-row items-center gap-3 rounded-[12px] border border-green-200 bg-green-50 p-4 max-w-lg">
          <CheckCircle className="text-green-500" />
          <p className="text-blue-gray-600 text-body">
            Usuário <span className="font-bold">{criado.login}</span> criado como{" "}
            <span className="font-bold">{criado.papel}</span>.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-5 rounded-[12px] border border-blue-gray-200 bg-white p-6 max-w-lg text-blue-gray-600">
        <div className="flex flex-col w-full justify-center">
          <p>Login (e-mail)</p>
          <TextInput
            leftIcon={<Person />}
            placeholder="usuario@clinica.com"
            type="email"
            value={form.login}
            onChange={(e) => atualizar("login", e.target.value)}
          />
        </div>

        <div className="flex flex-col w-full justify-center">
          <p>Senha</p>
          <TextInput
            leftIcon={<Lock />}
            placeholder="Senha de acesso"
            type="password"
            value={form.senha}
            onChange={(e) => atualizar("senha", e.target.value)}
          />
        </div>

        <div className="flex flex-col w-full justify-center">
          <div className="flex flex-row items-center gap-2">
            <Badge fontSize="small" />
            <p>Papel</p>
          </div>
          <select
            value={form.papel}
            onChange={(e) => atualizar("papel", e.target.value)}
            className="flex h-[52px] w-[350px] items-center rounded-[10px] border-[1.5px] border-surface bg-surface-variant px-[14px] text-[15px] text-blue-gray-600 outline-none focus:border-primary"
          >
            {PAPEIS.map((p) => (
              <option key={p.valor} value={p.valor}>
                {p.rotulo}
              </option>
            ))}
          </select>
        </div>

        {erro && <p className="text-red-500 text-body">{erro}</p>}

        <div className="flex justify-end">
          <Button type="button" onClick={salvar} isLoading={salvando}>
            Cadastrar usuário
          </Button>
        </div>
      </div>
    </div>
  );
}

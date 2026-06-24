"use client";

import { Home } from "@mui/icons-material";
import { TextInput } from "@/app/components/TextInput/TextInput";
import type { Endereco } from "@/app/lib/types";

// Bloco de formulário de endereço reutilizado nas telas de cadastro/edição
// (médicos e, futuramente, pacientes). Controlado pelo componente pai.
export function EnderecoForm({
  value,
  onChange,
}: {
  value: Endereco;
  onChange: (campo: keyof Endereco, valor: string) => void;
}) {
  return (
    <div className="flex flex-col w-full gap-5">
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
            value={value.cidade}
            onChange={(e) => onChange("cidade", e.target.value)}
          />
        </div>
        <div className="flex flex-col w-full justify-center">
          <p>UF</p>
          <TextInput
            placeholder="SP"
            type="text"
            maxLength={2}
            value={value.uf}
            onChange={(e) =>
              onChange(
                "uf",
                e.target.value.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 2)
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
            value={value.rua}
            onChange={(e) => onChange("rua", e.target.value)}
          />
        </div>
        <div className="flex flex-col w-full justify-center">
          <p>Casa</p>
          <TextInput
            placeholder="Número"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={value.numero ?? ""}
            onChange={(e) => onChange("numero", e.target.value.replace(/\D/g, ""))}
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
            value={value.cep}
            onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, "");
              const formatted =
                raw.length > 5 ? `${raw.slice(0, 5)}-${raw.slice(5, 8)}` : raw;
              onChange("cep", formatted);
            }}
          />
        </div>
        <div className="flex flex-col w-full justify-center">
          <p>Bairro</p>
          <TextInput
            placeholder="Ex: Centro"
            type="text"
            value={value.bairro}
            onChange={(e) => onChange("bairro", e.target.value)}
          />
        </div>
      </div>

      {/* Complemento */}
      <div className="flex flex-col w-full justify-center">
        <p>Complemento</p>
        <TextInput
          placeholder="Apto, bloco, etc."
          type="text"
          value={value.complemento ?? ""}
          onChange={(e) => onChange("complemento", e.target.value)}
        />
      </div>
    </div>
  );
}

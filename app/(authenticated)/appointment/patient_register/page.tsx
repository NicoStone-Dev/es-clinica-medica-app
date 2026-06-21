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
import { useState } from "react";

type Patient = {
  id: number;
  name: string;
  cpf: string;
  birthDate: string;
  phone: string;
  lastVisit: string;
};

const MOCK_PATIENTS: Patient[] = [
  {
    id: 1,
    name: "Ana Clara Souza",
    cpf: "012.345.678-90",
    birthDate: "12/03/1990",
    phone: "(11) 91234-5678",
    lastVisit: "10/06/2025",
  },
  {
    id: 2,
    name: "Bruno Mendes",
    cpf: "123.456.789-01",
    birthDate: "05/07/1985",
    phone: "(21) 98765-4321",
    lastVisit: "02/05/2025",
  },
  {
    id: 3,
    name: "Carla Ferreira",
    cpf: "234.567.890-12",
    birthDate: "22/11/1978",
    phone: "(31) 99876-5432",
    lastVisit: "18/04/2025",
  },
  {
    id: 4,
    name: "Diego Almeida",
    cpf: "345.678.901-23",
    birthDate: "30/01/2000",
    phone: "(41) 97654-3210",
    lastVisit: "01/06/2025",
  },
  {
    id: 5,
    name: "Eduarda Lima",
    cpf: "456.789.012-34",
    birthDate: "14/09/1995",
    phone: "(51) 96543-2109",
    lastVisit: "25/03/2025",
  },
  {
    id: 6,
    name: "Felipe Costa",
    cpf: "567.890.123-45",
    birthDate: "08/04/1972",
    phone: "(61) 95432-1098",
    lastVisit: "14/05/2025",
  },
  {
    id: 7,
    name: "Gabriela Rocha",
    cpf: "678.901.234-56",
    birthDate: "19/06/1988",
    phone: "(71) 94321-0987",
    lastVisit: "07/06/2025",
  },
  {
    id: 8,
    name: "Henrique Barbosa",
    cpf: "789.012.345-67",
    birthDate: "03/12/1965",
    phone: "(81) 93210-9876",
    lastVisit: "29/04/2025",
  },
];

const COLUMNS = [
  { key: "name" as const, label: "Nome" },
  { key: "cpf" as const, label: "CPF" },
  { key: "birthDate" as const, label: "Nascimento" },
  { key: "phone" as const, label: "Telefone" },
  { key: "lastVisit" as const, label: "Última Visita" },
];

export default function PatientRegister() {
  const [isModalOpen, setIsModalOpen] = useState(true);

  return (
    <div className="flex flex-col gap-4 px-16">
      <div className="gap-0">
        <h1 className="text-primary font-semibold text-body-emph">
          Realizando Fichamento do Paciente
        </h1>
        <p className="text-blue-gray-400 font-regular text-body">
          Insira o paciente a ser atendido
        </p>
      </div>
      <div className=" flex flex-row justify-between">
        <TextInput leftIcon={<Search />} placeholder="Pesquisar Paciente" />
        <Button rightIcon={<LibraryAdd />} onClick={() => setIsModalOpen(true)}>
          Fichar Novo Paciente
        </Button>
      </div>
      <div className="flex flex-col ">
        <Table
          data={MOCK_PATIENTS}
          columns={COLUMNS}
          onSelectionChange={(ids) => console.log("selected:", ids)}
          onRowClick={(row) => console.log("clicked:", row)}
        />
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Fichar Novo Paciente"
      >
        <div className="flex flex-row bg-transparent justify-between text-blue-gray-600 gap-12 m-xl mb-xs">
          {/* form colum 1 */}
          {/*   nome, email, telefone, cpf */}
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
              />
            </div>
            <div className="flex flex-col w-full justify-center">
              <p>CPF</p>
              <TextInput
                leftIcon={<Person />}
                placeholder="123.456.789-01"
                type="cpf"
                inputMode="numeric"
                pattern="[0-9]{11}"
                maxLength={11}
                onChange={(e) => {
                  // Remove any non-digit characters
                  e.target.value = e.target.value.replace(/\D/g, "");
                }}
              />
            </div>
            <div className="flex flex-col w-full justify-center">
              <p>Telefone</p>
              <TextInput
                leftIcon={<Phone />}
                placeholder="(99) 9 9999-9999"
                type="tel"
                inputMode="numeric"
                pattern="[0-9]{16}"
                maxLength={11}
                onChange={(e) => {
                  e.target.value = e.target.value.replace(/\D/g, "");
                }}
              />
            </div>
            <div className="flex flex-col w-full justify-center">
              <p>Email</p>
              <TextInput
                leftIcon={<Email />}
                placeholder="Email"
                type="email"
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
                <TextInput placeholder="Ex: São Paulo" type="text" />
              </div>
              <div className="flex flex-col w-full justify-center">
                <p>UF</p>
                <TextInput
                  placeholder="SP"
                  type="text"
                  maxLength={2}
                  onChange={(e) => {
                    // Only letters, uppercase, max 2
                    e.target.value = e.target.value
                      .replace(/[^a-zA-Z]/g, "")
                      .toUpperCase()
                      .slice(0, 2);
                  }}
                  className="uppercase"
                />
              </div>
            </div>

            {/* Rua + Casa */}
            <div className="flex flex-row gap-4">
              <div className="flex flex-col w-full justify-center">
                <p>Rua</p>
                <TextInput placeholder="Ex: Av. Paulista" type="text" />
              </div>
              <div className="flex flex-col w-full justify-center">
                <p>Casa</p>
                <TextInput
                  placeholder="Número"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  onChange={(e) => {
                    e.target.value = e.target.value.replace(/\D/g, "");
                  }}
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
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, "");
                    let formatted = raw;
                    if (raw.length > 5) {
                      formatted = `${raw.slice(0, 5)}-${raw.slice(5, 8)}`;
                    }
                    e.target.value = formatted;
                  }}
                />
              </div>
              <div className="flex flex-col w-full justify-center">
                <p>Bairro</p>
                <TextInput placeholder="Ex: Centro" type="text" />
              </div>
            </div>

            {/* Complemento */}
            <div className="flex flex-col w-full justify-center">
              <p>Complemento</p>
              <TextInput placeholder="Apto, bloco, etc." type="text" />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-md">
          <Button type="button" onClick={() => setIsModalOpen(false)}>
            Salvar
          </Button>
        </div>
      </Modal>
    </div>
  );
}

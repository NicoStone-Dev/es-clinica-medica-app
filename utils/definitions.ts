type Patient = {
  id: number;
  name: string;
  cpf: string;
  birthDate: string;
  phone: string;
  lastVisit: string;
};

// Medic Related

type MedicRegisterInput = {
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  crm: string;
  especialidade: Specialty;
  endereco: Address;
};

type MedicOutput = {
  id: string;
  name: string;
  email: string;
  crm: string;
  telefone: string;
  especialidade: Specialty;
  endereo: Address;
};

enum Specialty {
    ORTOPEDIA = "ORTOPEDIA",
    CARDIOLOGIA = "CARDIOLOGIA",
    GINECOLOGIA = "GINECOLOGIA",
    DERMATOLOGIA = "DERMATOLOGIA",
}

type Address = {
  cep: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
};